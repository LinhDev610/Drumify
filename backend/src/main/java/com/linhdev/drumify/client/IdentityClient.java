package com.linhdev.drumify.client;

import java.util.List;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.linhdev.drumify.dto.identity.*;

import feign.QueryMap;

@FeignClient(name = "identity-client", url = "${idp.url}")
public interface IdentityClient {
    @PostMapping(
            value = "/realms/drumify-dev/protocol/openid-connect/token",
            consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    TokenExchangeResponse exchangeToken(@QueryMap TokenExchangeParam param);

    @PostMapping(value = "/admin/realms/drumify-dev/users")
    ResponseEntity<?> createUser(@RequestHeader("authorization") String token, @RequestBody UserCreationParam param);

    @PutMapping(value = "/admin/realms/drumify-dev/users/{userId}/reset-password")
    ResponseEntity<?> resetPassword(
            @RequestHeader("authorization") String token,
            @PathVariable("userId") String userId,
            @RequestBody Credential credential);

    @GetMapping(value = "/admin/realms/drumify-dev/roles")
    List<RoleRepresentation> getRoles(@RequestHeader("authorization") String token);

    @GetMapping(value = "/admin/realms/drumify-dev/groups")
    List<GroupRepresentation> getGroups(@RequestHeader("authorization") String token);

    @PostMapping(value = "/admin/realms/drumify-dev/users/{userId}/role-mappings/realm")
    ResponseEntity<?> assignRoles(
            @RequestHeader("authorization") String token,
            @PathVariable("userId") String userId,
            @RequestBody List<RoleRepresentation> roles);

    @DeleteMapping(value = "/admin/realms/drumify-dev/users/{userId}/role-mappings/realm")
    ResponseEntity<?> removeRoles(
            @RequestHeader("authorization") String token,
            @PathVariable("userId") String userId,
            @RequestBody List<RoleRepresentation> roles);

    @GetMapping(value = "/admin/realms/drumify-dev/users/{userId}/role-mappings/realm")
    List<RoleRepresentation> getUserRoles(
            @RequestHeader("authorization") String token, @PathVariable("userId") String userId);

    @GetMapping(value = "/admin/realms/drumify-dev/users/{userId}/role-mappings/realm/composite")
    List<RoleRepresentation> getUserEffectiveRoles(
            @RequestHeader("authorization") String token, @PathVariable("userId") String userId);

    @PutMapping(value = "/admin/realms/drumify-dev/users/{userId}/groups/{groupId}")
    ResponseEntity<?> assignGroup(
            @RequestHeader("authorization") String token,
            @PathVariable("userId") String userId,
            @PathVariable("groupId") String groupId);

    @DeleteMapping(value = "/admin/realms/drumify-dev/users/{userId}/groups/{groupId}")
    ResponseEntity<?> removeGroup(
            @RequestHeader("authorization") String token,
            @PathVariable("userId") String userId,
            @PathVariable("groupId") String groupId);

    @GetMapping(value = "/admin/realms/drumify-dev/users/{userId}/groups")
    List<GroupRepresentation> getUserGroups(
            @RequestHeader("authorization") String token, @PathVariable("userId") String userId);
}
