import { Link } from 'react-router-dom';
import { useStore } from '../state/store';
import { Activity, User2, FileCheck, Bot, Server } from 'lucide-react';
import type { ActivityCategory } from '../types';

export function ActivityLogPage() {
  const { activities } = useStore();

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getCategoryIcon = (category: ActivityCategory) => {
    switch (category) {
      case 'PERSONA':
        return User2;
      case 'PROOF':
        return FileCheck;
      case 'AGENT':
        return Bot;
      case 'SYSTEM':
        return Server;
      default:
        return Activity;
    }
  };

  const getCategoryColor = (category: ActivityCategory) => {
    switch (category) {
      case 'PERSONA':
        return 'purple';
      case 'PROOF':
        return 'green';
      case 'AGENT':
        return 'blue';
      case 'SYSTEM':
        return 'gray';
      default:
        return 'gray';
    }
  };

  const groupedActivities = activities.reduce((acc, activity) => {
    const date = new Date(activity.timestamp);
    const dateKey = date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });

    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(activity);
    return acc;
  }, {} as Record<string, typeof activities>);

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Activity Log</h1>
          <p className="text-gray-600">
            Timeline of all your persona activations, proof generations, and agent interactions.
          </p>
        </div>

        {activities.length > 0 ? (
          <div className="space-y-8">
            {Object.entries(groupedActivities).map(([date, items]) => (
              <div key={date}>
                <h2 className="text-lg font-semibold text-gray-900 mb-4 sticky top-0 bg-gray-50 py-2">
                  {date}
                </h2>
                <div className="relative border-l-2 border-gray-200 ml-6 space-y-6">
                  {items.map((activity) => {
                    const Icon = getCategoryIcon(activity.category);
                    const color = getCategoryColor(activity.category);

                    return (
                      <div key={activity.id} className="relative pl-8 pb-6">
                        <div
                          className={`absolute -left-4 w-8 h-8 rounded-full flex items-center justify-center bg-${color}-100 border-4 border-gray-50`}
                        >
                          <Icon className={`w-4 h-4 text-${color}-600`} />
                        </div>

                        <div className="bg-white rounded-lg border border-gray-200 p-4 hover:border-gray-300 transition-colors">
                          <div className="flex items-start justify-between mb-2">
                            <p className="text-gray-900 font-medium">{activity.label}</p>
                            <span
                              className={`text-xs font-medium px-2 py-1 rounded bg-${color}-100 text-${color}-700`}
                            >
                              {activity.category}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500">
                            {formatTimestamp(activity.timestamp)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No activity yet</h3>
            <p className="text-gray-600 mb-6">
              Your persona activations, proof generations, and agent interactions will appear here.
            </p>
            <Link
              to="/app/personas"
              className="inline-flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <User2 className="w-4 h-4" />
              <span>Activate Your First Persona</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
