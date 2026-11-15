
export type Vehicle = {
    id: number
    brand: string
    model: string
    year: number
    price: number
    mileage: number
    fuel: string
    bodyType: string
    image: string
  }
  
  export const vehicles: Vehicle[] = [
    {
      id: 1,
      brand: 'BMW',
      model: '5 Series',
      year: 2022,
      price: 38500,
      mileage: 42000,
      fuel: 'Дизель',
      bodyType: 'Седан',
      image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=900',
    },
    {
      id: 2,
      brand: 'Mercedes-Benz',
      model: 'E-Class',
      year: 2023,
      price: 45900,
      mileage: 28000,
      fuel: 'Бензин',
      bodyType: 'Седан',
      image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=900',
    },
    {
      id: 3,
      brand: 'Audi',
      model: 'A6',
      year: 2021,
      price: 32800,
      mileage: 56000,
      fuel: 'Дизель',
      bodyType: 'Седан',
      image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=900',
    },
    {
      id: 4,
      brand: 'BMW',
      model: 'X5',
      year: 2022,
      price: 52700,
      mileage: 35000,
      fuel: 'Дизель',
      bodyType: 'Позашляховик',
      image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=900',
    },
    {
      id: 5,
      brand: 'Audi',
      model: 'Q7',
      year: 2020,
      price: 41500,
      mileage: 68000,
      fuel: 'Дизель',
      bodyType: 'Позашляховик',
      image: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=900',
    },
    {
      id: 6,
      brand: 'Mercedes-Benz',
      model: 'C-Class',
      year: 2021,
      price: 29900,
      mileage: 49000,
      fuel: 'Бензин',
      bodyType: 'Седан',
      image: 'https://images.unsplash.com/photo-1618843479618-39b6f2f8e4c8?w=900',
    },
    {
      id: 7,
      brand: 'Volkswagen',
      model: 'Tiguan',
      year: 2022,
      price: 27500,
      mileage: 39000,
      fuel: 'Бензин',
      bodyType: 'Позашляховик',
      image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=900',
    },
    {
      id: 8,
      brand: 'Toyota',
      model: 'Camry',
      year: 2023,
      price: 31500,
      mileage: 22000,
      fuel: 'Гібрид',
      bodyType: 'Седан',
      image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=900',
    },
  ]
  