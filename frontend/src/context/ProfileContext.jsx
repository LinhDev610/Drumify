import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useKeycloakAuth } from './KeycloakAuthContext';
import { getMyProfile } from '../services/userService';

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
    const { authenticated } = useKeycloakAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(false);

    const refreshProfile = useCallback(async () => {
        if (!authenticated) {
            setProfile(null);
            return;
        }

        try {
            setLoading(true);
            const response = await getMyProfile();
            if (response.data?.result) {
                setProfile(response.data.result);
            }
        } catch (error) {
            console.error("Error fetching profile in context:", error);
        } finally {
            setLoading(false);
        }
    }, [authenticated]);

    useEffect(() => {
        refreshProfile();
    }, [refreshProfile]);

    return (
        <ProfileContext.Provider value={{ profile, loading, refreshProfile, setProfile }}>
            {children}
        </ProfileContext.Provider>
    );
};

export const useProfile = () => {
    const context = useContext(ProfileContext);
    if (!context) {
        throw new Error('useProfile must be used within a ProfileProvider');
    }
    return context;
};
