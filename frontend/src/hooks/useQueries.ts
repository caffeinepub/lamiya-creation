import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Product } from '../backend';

export function useGetAllProducts() {
  const { actor, isFetching } = useActor();

  return useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      const result = await actor.getAllProducts();
      return result;
    },
    enabled: !!actor && !isFetching,
    staleTime: 1000 * 60 * 5,
    retry: 3,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10000),
  });
}

export function useGetProductById(id: bigint | null) {
  const { actor, isFetching } = useActor();

  return useQuery<Product | null>({
    queryKey: ['product', id?.toString()],
    queryFn: async () => {
      if (!actor || id === null) return null;
      try {
        return await actor.getProductById(id);
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching && id !== null,
    staleTime: 1000 * 60 * 5,
  });
}

export function useAddToCart() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({
      productId,
      size,
      quantity,
    }: {
      productId: bigint;
      size: string;
      quantity: bigint;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.addToCart(productId, size, quantity);
    },
  });
}

export function useRemoveFromCart() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({ productId, size }: { productId: bigint; size: string }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.removeFromCart(productId, size);
    },
  });
}

export function useClearCart() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.clearCart();
    },
  });
}

export function useCheckout() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      deliveryName,
      deliveryAddress,
    }: {
      deliveryName: string;
      deliveryAddress: string;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.checkout(deliveryName, deliveryAddress);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

export function useGetOrders() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getOrders();
    },
    enabled: !!actor && !isFetching,
  });
}
