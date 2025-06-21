import { useMutation, useQuery } from "@tanstack/react-query";
import * as userRepository from "@/lib/repositories/user";
import { useUser } from "@auth0/nextjs-auth0";
import { toast } from "sonner";

export function useCurrentUser() {
    const { user } = useUser();

    return useQuery({
        queryKey: ['user', 'current'],
        queryFn: userRepository.getCurrentUser,
        enabled: !!user,
    });
}

export function useUpdateUser() {
    return useMutation({
        mutationFn: userRepository.updateUser,
        onSuccess: () => toast.success('Profile updated successfully'),
        onError: () => toast.error('Failed to update profile'),
    });
}