package com.linhdev.drumify.configuration;

import java.util.*;
import java.util.stream.Collectors;

import org.springframework.core.convert.converter.Converter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;

public class CustomAuthoritiesConverter implements Converter<Jwt, Collection<GrantedAuthority>> {
    private final String REALM_ACCESS = "realm_access";
    private final String ROLE_PREFIX = "ROLE_";
    private final String ROLES = "roles";
    private final String GROUP_PREFIX = "GROUP_";
    private final String USER_GROUPS = "user_groups";

    @Override
    public List<GrantedAuthority> convert(Jwt source) {

        List<GrantedAuthority> authorities = new ArrayList<>();

        // ROLES
        Map<String, Object> realmAccessMap = source.getClaimAsMap(REALM_ACCESS);

        if (realmAccessMap != null) {
            Object roles = realmAccessMap.get(ROLES);

            if (roles instanceof List<?> stringRoles) {
                stringRoles.stream()
                    .filter(String.class::isInstance)
                    .map(String.class::cast)
                    .map(s -> new SimpleGrantedAuthority(ROLE_PREFIX + s))
                    .forEach(authorities::add);
            }
        }

        // GROUPS
        Object groups = source.getClaim(USER_GROUPS);

        if (groups instanceof List<?> stringGroups) {
            stringGroups.stream()
                    .filter(String.class::isInstance)
                    .map(String.class::cast)
                    .map(s -> new SimpleGrantedAuthority(GROUP_PREFIX + s))
                    .forEach(authorities::add);
        }

        return authorities;
    }
}
