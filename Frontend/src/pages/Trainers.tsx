import { useAuth0 } from '@auth0/auth0-react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/utils/tw';
import { LoadingSpinner } from '@/components/loading/LoadingSpinner';
import { useGetUserTrainersUserUserIdTrainersGet, useGetTrainerUsersTrainerTrainerIdUsersGet, useAcceptUserConnectionTrainerTrainerIdAcceptUserUserIdPut, useUserDisconnectTrainerUserUserIdDisconnectTrainerTrainerIdDelete, useTrainerDisconnectUserTrainerTrainerIdDisconnectUserUserIdDelete, useConnectToTrainerUserUserIdConnectTrainerTrainerIdPost, useGetUsersUsersGet } from '@/api/generated/fastAPI';
import { TrainerSelect } from '@/components/trainer/TrainerSelect';
import { useState, useEffect } from 'react';
import type { TrainerUserRelationship } from '@/api/generated/model/trainerUserRelationship';
import type { Auth0User } from '@/types/auth0';
import { UserAvatar } from '@/components/common/UserAvatar';

interface TrainerWithInfo extends TrainerUserRelationship {
  name: string;
  email: string;
  picture?: string;
}

export function Trainers() {
  const { user } = useAuth0();
  const { isDarkMode } = useTheme();
  const [trainersWithInfo, setTrainersWithInfo] = useState<TrainerWithInfo[]>([]);
  const [traineesWithInfo, setTraineesWithInfo] = useState<TrainerWithInfo[]>([]);

  const { data: trainers, isLoading: isLoadingTrainers, refetch: refetchTrainers } = useGetUserTrainersUserUserIdTrainersGet(
    user?.sub || '',
  );

  const { data: trainees, isLoading: isLoadingTrainees, refetch: refetchTrainees } = useGetTrainerUsersTrainerTrainerIdUsersGet(
    user?.sub || '',
  );

  const { mutate: acceptUser } = useAcceptUserConnectionTrainerTrainerIdAcceptUserUserIdPut({
    mutation: {
      onSuccess: () => {
        refetchTrainees();
      },
    },
  });

  const { mutate: disconnectTrainer } = useUserDisconnectTrainerUserUserIdDisconnectTrainerTrainerIdDelete({
    mutation: {
      onSuccess: () => {
        refetchTrainers();
      },
    },
  });

  const { mutate: disconnectTrainee } = useTrainerDisconnectUserTrainerTrainerIdDisconnectUserUserIdDelete({
    mutation: {
      onSuccess: () => {
        refetchTrainees();
      },
    },
  });

  const { mutate: connectToTrainer } = useConnectToTrainerUserUserIdConnectTrainerTrainerIdPost({
    mutation: {
      onSuccess: () => {
        refetchTrainers();
      },
    },
  });

  const trainerUserIds = trainers?.map(t => t.trainer_id) || [];
  const traineeUserIds = trainees?.map(t => t.user_id) || [];
  const { data: trainerUsers = [], isLoading: isLoadingTrainerUsers } = useGetUsersUsersGet({
    user_ids: trainerUserIds
  });
  const { data: traineeUsers = [], isLoading: isLoadingTraineeUsers } = useGetUsersUsersGet({
    user_ids: traineeUserIds
  });

  useEffect(() => {
    if (trainers && trainerUsers) {
      const trainersWithInfo = trainers.map(trainer => {
        const userInfo = (trainerUsers as unknown as Auth0User[]).find(u => u.user_id === trainer.trainer_id);
        return {
          ...trainer,
          name: userInfo?.name || 'Unknown',
          email: userInfo?.email || 'Unknown',
          picture: userInfo?.picture,
        };
      });
      setTrainersWithInfo(trainersWithInfo);
    }
  }, [trainers, trainerUsers]);

  useEffect(() => {
    if (trainees && traineeUsers) {
      const traineesWithInfo = trainees.map(trainee => {
        const userInfo = (traineeUsers as unknown as Auth0User[]).find(u => u.user_id === trainee.user_id);
        return {
          ...trainee,
          name: userInfo?.name || 'Unknown',
          email: userInfo?.email || 'Unknown',
          picture: userInfo?.picture,
        };
      });
      setTraineesWithInfo(traineesWithInfo);
    }
  }, [trainees, traineeUsers]);

  const isAlreadyTrainer = (userId: string): boolean => {
    return trainers?.some(trainer => trainer.trainer_id === userId) || false;
  };

  if (isLoadingTrainers || isLoadingTrainees || isLoadingTrainerUsers || isLoadingTraineeUsers) {
    return <LoadingSpinner size="lg" />;
  }

  return (
    <div className="space-y-8">
      <div>
        <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0 pb-4">
          <h1 className={cn(
            "text-2xl font-bold",
            isDarkMode ? "text-white" : "text-gray-900"
          )}>My Trainers</h1>

          <TrainerSelect
            onSelect={(trainer) => connectToTrainer({
              userId: user?.sub || '',
              trainerId: trainer.user_id,
            })}
            isAlreadyTrainer={isAlreadyTrainer}
          />
        </div>

        <div className="space-y-4">
          {trainersWithInfo.length === 0 ? (
            <div className={cn(
              "text-center py-8",
              isDarkMode ? "text-gray-400" : "text-gray-500"
            )}>
              <p>You don't have any trainers yet.</p>
              <p className="mt-2">Use the dropdown above to connect with a trainer!</p>
            </div>
          ) : (
            trainersWithInfo.map((trainer) => (
              <div key={trainer.trainer_id} className={cn(
                "p-4 rounded-lg shadow",
                isDarkMode ? "bg-gray-800" : "bg-white"
              )}>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className="relative group">
                      <UserAvatar
                        name={trainer.name}
                        picture={trainer.picture}
                        size="lg"
                      />
                      <div className={cn(
                        "absolute -bottom-0 -right-0 w-3 h-3 rounded-full border-2",
                        trainer.state === 'active' && (isDarkMode 
                          ? "bg-green-400 border-gray-800 animate-pulse" 
                          : "bg-green-500 border-white"),
                        trainer.state === 'pending' && (isDarkMode 
                          ? "bg-yellow-400 border-gray-800 animate-pulse" 
                          : "bg-yellow-500 border-white")
                      )} />
                      <div className={cn(
                        "absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 text-xs font-medium rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap",
                        isDarkMode 
                          ? "bg-gray-800 text-white shadow-lg" 
                          : "bg-gray-900 text-white shadow-lg"
                      )}>
                        {trainer.state === 'active' ? 'Active trainer' : 'Pending approval'}
                        <div className={cn(
                          "absolute -top-1/2 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45",
                          isDarkMode ? "bg-gray-800" : "bg-gray-900"
                        )} />
                      </div>
                    </div>
                    <div>
                      <h3 className={cn(
                        "text-lg font-semibold",
                        isDarkMode ? "text-white" : "text-gray-900"
                      )}>{trainer.name}</h3>
                      <p className={cn(
                        "text-sm",
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      )}>{trainer.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => disconnectTrainer({
                      userId: user?.sub || '',
                      trainerId: trainer.trainer_id,
                    })}
                    className={cn(
                      "px-4 py-2 rounded-md cursor-pointer",
                      isDarkMode
                        ? "bg-red-800/20 text-red-400 hover:bg-red-800/30"
                        : "bg-red-100 text-red-600 hover:bg-red-200"
                    )}
                  >
                    Revoke
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {traineesWithInfo.length > 0 && (
        <div>
          <h2 className={cn(
            "text-xl font-semibold mb-4",
            isDarkMode ? "text-white" : "text-gray-900"
          )}>My Trainees</h2>
          <div className="space-y-4">
            {traineesWithInfo.map((trainee) => (
              <div key={trainee.user_id} className={cn(
                "p-4 rounded-lg shadow",
                isDarkMode ? "bg-gray-800" : "bg-white"
              )}>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <UserAvatar
                        name={trainee.name}
                        picture={trainee.picture}
                        size="lg"
                      />
                    </div>
                    <div>
                      <h3 className={cn(
                        "text-lg font-semibold",
                        isDarkMode ? "text-white" : "text-gray-900"
                      )}>{trainee.name}</h3>
                      <p className={cn(
                        "text-sm",
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      )}>{trainee.email}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {trainee.state === 'pending' && (
                      <button
                        onClick={() => acceptUser({
                          trainerId: user?.sub || '',
                          userId: trainee.user_id,
                        })}
                        className={cn(
                          "px-4 py-2 rounded-md cursor-pointer",
                          isDarkMode
                            ? "bg-green-600 text-white hover:bg-green-700"
                            : "bg-green-500 text-white hover:bg-green-600"
                        )}
                      >
                        Accept
                      </button>
                    )}
                    <button
                      onClick={() => disconnectTrainee({
                        trainerId: user?.sub || '',
                        userId: trainee.user_id,
                      })}
                      className={cn(
                        "px-4 py-2 rounded-md cursor-pointer",
                        isDarkMode
                          ? "bg-red-800/20 text-red-400 hover:bg-red-800/30"
                          : "bg-red-100 text-red-600 hover:bg-red-200"
                      )}
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 