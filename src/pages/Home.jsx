import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '../components/ApperIcon';
import GroupsSection from '../components/GroupsSection';
import MainFeature from '../components/MainFeature';
import ActivityFeed from '../components/ActivityFeed';

const Home = () => {
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [groups, setGroups] = useState([]);
  const [activeGroupId, setActiveGroupId] = useState('');
  
  const startApp = () => {
    setShowOnboarding(false);
  };
  

  return (
    <div className="min-h-screen">
      <AnimatePresence mode="wait">
        {showOnboarding ? (
          <motion.div 
            key="onboarding"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex flex-col"
          >
            <header className="bg-white dark:bg-surface-800 shadow-sm py-4">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <ApperIcon name="SplitSquareVertical" className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-xl font-semibold">DivvyUp</span>
                </div>
              </div>
            </header>
            
            <main className="flex-grow">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="max-w-3xl mx-auto text-center mb-12">
                  <motion.h1 
                    className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    Split Expenses With Friends, Simplified
                  </motion.h1>
                  
                  <motion.p 
                    className="text-lg md:text-xl text-surface-600 dark:text-surface-300 mb-8"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    Track shared expenses, split bills fairly, and settle up with ease.
                    No more awkward money talks or complicated calculations.
                  </motion.p>
                  
                  <motion.button
                    className="btn btn-primary text-lg px-8 py-3 shadow-lg hover:shadow-xl"
                    onClick={startApp}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    Get Started
                  </motion.button>
                </div>
                
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto"
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <div className="card text-center">
                    <div className="bg-primary-light/10 dark:bg-primary-dark/20 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <ApperIcon name="Receipt" className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Track Expenses</h3>
                    <p className="text-surface-600 dark:text-surface-400">
                      Record group expenses and split them in various ways: equally, by percentage, or custom amounts.
                    </p>
                  </div>
                  
                  <div className="card text-center">
                    <div className="bg-secondary-light/10 dark:bg-secondary-dark/20 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <ApperIcon name="BarChart4" className="h-8 w-8 text-secondary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Track Balances</h3>
                    <p className="text-surface-600 dark:text-surface-400">
                      See at a glance who owes what to whom with our smart balance calculation system.
                    </p>
                  </div>
                  
                  <div className="card text-center">
                    <div className="bg-accent/10 dark:bg-accent/20 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <ApperIcon name="Wallet" className="h-8 w-8 text-accent" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Settle Debts</h3>
                    <p className="text-surface-600 dark:text-surface-400">
                      Minimize the number of transactions needed to settle group debts with our optimized payment suggestions.
                    </p>
                  </div>
                </motion.div>
              </div>
            </main>
          </motion.div>
        ) : (
          <motion.div 
            key="app"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen"
          >
            <header className="bg-white dark:bg-surface-800 shadow-sm py-4 sticky top-0 z-10">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <ApperIcon name="SplitSquareVertical" className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-xl font-semibold">DivvyUp</span>
                </div>
              </div>
            </header>
            
            <main className="py-6">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Groups Section */}
                <div className="max-w-5xl mx-auto">
                  <h2 className="text-2xl font-bold mb-4">Manage Groups</h2>
                  <p className="text-surface-600 dark:text-surface-400 mb-6">Create and manage your expense groups to track shared costs.</p>
                  <GroupsSection 
                    groups={groups}
                    setGroups={setGroups}
                    activeGroupId={activeGroupId}
                    setActiveGroupId={setActiveGroupId}
                  />
                </div>
                
                <MainFeature externalGroups={groups} setExternalGroups={setGroups} externalActiveGroupId={activeGroupId} setExternalActiveGroupId={setActiveGroupId} />
                
                {/* Activity Feed Section */}
                <div className="max-w-5xl mx-auto mt-8">
                  <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
                  <p className="text-surface-600 dark:text-surface-400 mb-6">Stay updated with all expense activities across your groups.</p>
                  <ActivityFeed />
                </div>
              </div>
            </main>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;