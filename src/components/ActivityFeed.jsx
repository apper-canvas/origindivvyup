import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, formatDistanceToNow, isAfter, isBefore, parseISO } from 'date-fns';
import ApperIcon from './ApperIcon';
import FilterBar from './FilterBar';

// Sample activity data for demo purposes
const initialActivities = [
  {
    id: 'a1',
    id: 'a1',
    type: 'expense',
    date: new Date(2023, 9, 26, 19, 30), // Oct 26, 2023, 7:30 PM
    user: 'Jane',
    description: 'added a dinner expense for',
    amount: 50.00,
    group: 'Roommates',
    groupId: 'g1'
  },
  {
    id: 'a2',
    type: 'payment',
    date: new Date(2023, 9, 27, 10, 15), // Oct 27, 2023, 10:15 AM
    date: new Date(2023, 9, 27, 10, 15), // Oct 27, 2023, 10:15 AM
    user: 'John',
    description: 'paid',
    to: 'Sara',
    amount: 35.50,
    group: 'Roommates',
    groupId: 'g1'
  },
  {
    id: 'a3',
    type: 'settlement',
    date: new Date(2023, 9, 27, 14, 45), // Oct 27, 2023, 2:45 PM
    user: 'John',
    description: 'settled his share of the movie ticket expense',
    group: 'Trip to Paris',
    groupId: 'g2'
  },
  {
    id: 'a4',
    type: 'expense',
    date: new Date(2023, 9, 25, 11, 20), // Oct 25, 2023, 11:20 AM
    user: 'Miguel',
    description: 'added a grocery expense for',
    amount: 87.25,
    group: 'Roommates',
    groupId: 'g1'
  },
  {
    id: 'a5',
    type: 'payment',
    date: new Date(2023, 9, 24, 16, 30), // Oct 24, 2023, 4:30 PM
    user: 'Lisa',
    description: 'paid',
    to: 'Tom',
    amount: 125.00,
    group: 'Trip to Paris',
    groupId: 'g2'
  },
  {
    id: 'a6',
    type: 'expense',
    date: new Date(2023, 9, 23, 9, 0), // Oct 23, 2023, 9:00 AM
    user: 'Sara',
    description: 'added a utilities expense for',
    amount: 142.30,
    group: 'Roommates',
    groupId: 'g1'
  },
  {
    id: 'a7',
    type: 'settlement',
    date: new Date(2023, 9, 22, 20, 15), // Oct 22, 2023, 8:15 PM
    user: 'Emily',
    description: 'settled all outstanding balances with',
    to: 'Lisa',
    group: 'Trip to Paris',
    groupId: 'g2'
  }
];

const ActivityFeed = () => {
  const [activities] = useState(initialActivities);
  const [filter, setFilter] = useState('all');
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    searchTerm: ''
  });

  // Filter activities based on all filter criteria
  const filteredActivities = activities.filter(activity => {
    // Type filter
    if (filter !== 'all' && activity.type !== filter) return false;
    
    // Date range filter
    if (filters.startDate && isBefore(activity.date, new Date(filters.startDate))) return false;
    if (filters.endDate && isAfter(activity.date, new Date(`${filters.endDate}T23:59:59`))) return false;
    
    // Search term filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      const activityText = `${activity.user} ${activity.description} ${activity.to || ''} ${activity.group}`.toLowerCase();
      if (!activityText.includes(searchLower)) return false;
    }
    return activity.type === filter;
  });

  // Get appropriate icon for activity type
  const getActivityIcon = (type) => {
    switch (type) {
      case 'expense': return 'ReceiptText';
      case 'payment': return 'ArrowRightLeft';
      case 'settlement': return 'CheckCircle';
      default: return 'Activity';
    }
  };

  // Get activity indicator color class based on type
  const getActivityColorClass = (type) => {
    switch (type) {
      case 'expense': return 'bg-accent';
      case 'payment': return 'bg-primary';
      case 'settlement': return 'bg-secondary';
      default: return 'bg-surface-400';
    }
  };
  
  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };
  
  // Get unique categories for filter dropdown
  const uniqueGroups = [...new Set(activities.map(activity => activity.group))];

  return (
    <div className="card">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-xl font-bold">Activity Feed</h2>
        
      </div>
      
        {/* Filter buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              filter === 'all'
                ? 'bg-primary text-white shadow-md'
                : 'bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('expense')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              filter === 'expense'
                ? 'bg-accent text-white shadow-md'
                : 'bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700'
            }`}
          >
            Expenses
          </button>
          <button
            onClick={() => setFilter('payment')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              filter === 'payment'
                ? 'bg-primary text-white shadow-md'
                : 'bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700'
            }`}
          >
            Payments
          </button>
          <button
            onClick={() => setFilter('settlement')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              filter === 'settlement'
                ? 'bg-secondary text-white shadow-md'
                : 'bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700'
            }`}
          >
            Settlements
          </button>
        </div>
      
      {/* Advanced filtering */}
      <FilterBar 
        onFilterChange={handleFilterChange}
        categories={uniqueGroups}
        showCategoryFilter={false}
        activeFilters={filters}
      />
      
      {filteredActivities.length === 0 && (
        <p className="text-center text-surface-500 dark:text-surface-400 my-4">No activities match your filter criteria.</p>
      )}
      
      {/* Activity list */}
      <div className="activity-timeline relative pl-6 border-l border-surface-200 dark:border-surface-700 space-y-6">
        {filteredActivities.length === 0 ? (
          <div className="py-4 text-center text-surface-500 dark:text-surface-400">
            No activities to display with the current filter.
          </div>
        ) : (
          filteredActivities.map((activity) => (
            <motion.div 
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              {/* Activity indicator dot */}
              <div className={`absolute -left-10 w-4 h-4 rounded-full ${getActivityColorClass(activity.type)} border-2 border-white dark:border-surface-800`}></div>
              
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <div className="flex items-center gap-2 text-sm text-surface-600 dark:text-surface-400">
                  <ApperIcon name={getActivityIcon(activity.type)} className="h-4 w-4" />
                  <span className="font-medium">{activity.user}</span>
                  <span>{activity.description}</span>
                  {activity.amount && (
                    <span className="font-medium">${activity.amount.toFixed(2)}</span>
                  )}
                  {activity.to && (
                    <span className="font-medium">{activity.to}</span>
                  )}
                  <span className="text-xs px-2 py-0.5 rounded-full bg-surface-100 dark:bg-surface-700">
                    {activity.group}
                  </span>
                </div>
                <div className="text-xs text-surface-500 dark:text-surface-500 ml-auto">
                  {formatDistanceToNow(activity.date, { addSuffix: true })}
                </div>
              </div>
              <div className="text-xs text-surface-500 dark:text-surface-400 mt-1">
                {format(activity.date, 'MMMM d, yyyy • h:mm a')}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default ActivityFeed;