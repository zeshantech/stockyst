import { useMutation, useQuery } from "@tanstack/react-query";
import * as userRepository from "@/lib/repositories/user";
import { toast } from "sonner";
import { useAuth } from "@clerk/nextjs";

export function useCurrentUser() {
    const { isSignedIn } = useAuth();

    return useQuery({
        queryKey: ['user', 'current'],
        queryFn: userRepository.getCurrentUser,
        enabled: isSignedIn,
    });
}

export function useUpdateUser() {
    return useMutation({
        mutationFn: userRepository.updateUser,
        onSuccess: () => toast.success('Profile updated successfully'),
        onError: () => toast.error('Failed to update profile'),
    });
}