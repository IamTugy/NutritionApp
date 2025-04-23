import { useQuery } from '@tanstack/react-query';

export function Trainers() {
  const { data: trainersData, isLoading } = useQuery({
    queryKey: ['trainers'],
    queryFn: async () => {
      // TODO: Replace with actual API call
      return {
        trainers: [
          {
            id: 1,
            name: 'John Doe',
            specialization: 'Nutrition',
            clients: 15,
            rating: 4.8,
            image: 'https://via.placeholder.com/150',
          },
          {
            id: 2,
            name: 'Jane Smith',
            specialization: 'Fitness & Nutrition',
            clients: 20,
            rating: 4.9,
            image: 'https://via.placeholder.com/150',
          },
        ],
        myTrainers: [
          {
            id: 1,
            name: 'John Doe',
            specialization: 'Nutrition',
            joinedDate: '2024-01-15',
            image: 'https://via.placeholder.com/150',
          },
        ],
      };
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Trainers</h1>
      
      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-4">My Trainers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {trainersData?.myTrainers.map((trainer) => (
              <div key={trainer.id} className="bg-white p-6 rounded-lg shadow flex items-center space-x-4">
                <img
                  src={trainer.image}
                  alt={trainer.name}
                  className="w-16 h-16 rounded-full"
                />
                <div>
                  <h3 className="font-semibold">{trainer.name}</h3>
                  <p className="text-sm text-gray-600">{trainer.specialization}</p>
                  <p className="text-sm text-gray-500">Joined: {trainer.joinedDate}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Available Trainers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {trainersData?.trainers.map((trainer) => (
              <div key={trainer.id} className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center space-x-4">
                  <img
                    src={trainer.image}
                    alt={trainer.name}
                    className="w-16 h-16 rounded-full"
                  />
                  <div>
                    <h3 className="font-semibold">{trainer.name}</h3>
                    <p className="text-sm text-gray-600">{trainer.specialization}</p>
                    <div className="flex items-center space-x-2">
                      <span className="text-yellow-400">★</span>
                      <span className="text-sm text-gray-600">{trainer.rating}</span>
                      <span className="text-sm text-gray-500">({trainer.clients} clients)</span>
                    </div>
                  </div>
                </div>
                <button className="mt-4 w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 cursor-pointer">
                  Connect
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
} 