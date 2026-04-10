package com.drumify.keycloak.events;

import org.keycloak.Config;
import org.keycloak.events.EventListenerProvider;
import org.keycloak.events.EventListenerProviderFactory;
import org.keycloak.models.KeycloakSession;
import org.keycloak.models.KeycloakSessionFactory;

// Nhà máy sản xuất Provider để Keycloak có thể nhận diện.
public class RegistrationEventListenerFactory implements EventListenerProviderFactory {

    private String backendUrl;
    private String syncSecret;

    @Override
    public EventListenerProvider create(KeycloakSession session) {
        return new RegistrationEventListener(session, session.getContext().getRealm(), backendUrl, syncSecret);
    }

    @Override
    public void init(Config.Scope scope) {
        // Read from environment variables
        backendUrl = System.getenv("DRUMIFY_BACKEND_URL");
        syncSecret = System.getenv("DRUMIFY_SYNC_SECRET");

        // Fallbacks for local dev if not set
        if (backendUrl == null) backendUrl = "http://host.docker.internal:8080/drumify";
        if (syncSecret == null) syncSecret = "DrumifySyncSecret2026";
    }

    @Override
    public void postInit(KeycloakSessionFactory keycloakSessionFactory) {
    }

    @Override
    public void close() {
    }

    @Override
    public String getId() {
        return "drumify-registration-listener";
    }
}
