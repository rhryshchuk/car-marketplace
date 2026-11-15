export function favoriteVehicles<T extends { id: number }>(
  vehicles: readonly T[],
  favoriteIds: readonly number[],
): T[] {
  const byId = new Map(vehicles.map((vehicle) => [vehicle.id, vehicle]))

  return favoriteIds.flatMap((id) => {
    const vehicle = byId.get(id)
    return vehicle === undefined ? [] : [vehicle]
  })
}
