package com.drumify.keycloak.events;

import org.jboss.logging.Logger;
import org.keycloak.events.Event;
import org.keycloak.events.EventListenerProvider;
import org.keycloak.events.EventType;
import org.keycloak.events.admin.AdminEvent;
import org.keycloak.models.KeycloakSession;
import org.keycloak.models.RealmModel;
import org.keycloak.models.UserModel;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.concurrent.CompletableFuture;

// Logic nhận diện sự kiện REGISTER và log thông tin người dùng mới (ID, Email, Username).
public class RegistrationEventListener implements EventListenerProvider {

    private static final Logger logger = Logger.getLogger(RegistrationEventListener.class);
    private final KeycloakSession session;
    private final RealmModel realm;
    private final String backendUrl;
    private final String syncSecret;
    private final HttpClient httpClient;

    public RegistrationEventListener(KeycloakSession session, RealmModel realm, String backendUrl, String syncSecret) {
        this.session = session;
        this.realm = realm;
        this.backendUrl = backendUrl;
        this.syncSecret = syncSecret;
        this.httpClient = HttpClient.newHttpClient();
    }

    @Override
    public void onEvent(Event event) {
        if (EventType.REGISTER.equals(event.getType())) {
            logger.infof("Registration event detected for user: %s", event.getUserId());
            
            UserModel user = session.users().getUserById(realm, event.getUserId());
            if (user != null) {
                syncToBackend(user);
            }
        }
    }

    private void syncToBackend(UserModel user) {
        try {
            // Build JSON payload
            String jsonPayload = String.format(
                "{\"username\":\"%s\", \"email\":\"%s\", \"firstName\":\"%s\", \"lastName\":\"%s\"}",
                user.getUsername(),
                user.getEmail() != null ? user.getEmail() : "",
                user.getFirstName() != null ? user.getFirstName() : "",
                user.getLastName() != null ? user.getLastName() : ""
            );

            String url = backendUrl + "/internal/sync?userId=" + user.getId();
            
            logger.infof("Syncing user %s to backend: %s", user.getUsername(), url);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .header("Content-Type", "application/json")
                    .header("X-Internal-Secret", syncSecret)
                    .POST(HttpRequest.BodyPublishers.ofString(jsonPayload))
                    .build();

            // Send asynchronously to not block Keycloak flow
            httpClient.sendAsync(request, HttpResponse.BodyHandlers.ofString())
                    .thenApply(HttpResponse::statusCode)
                    .thenAccept(status -> {
                        if (status >= 200 && status < 300) {
                            logger.infof("Successfully synced user %s to backend", user.getUsername());
                        } else {
                            logger.errorf("Failed to sync user %s. Backend returned status: %d", user.getUsername(), status);
                        }
                    })
                    .exceptionally(ex -> {
                        logger.errorf("Error calling backend sync for user %s: %s", user.getUsername(), ex.getMessage());
                        return null;
                    });

        } catch (Exception e) {
            logger.error("Failed to prepare backend sync request", e);
        }
    }

    @Override
    public void onEvent(AdminEvent adminEvent, boolean b) {
    }

    @Override
    public void close() {
    }
}
