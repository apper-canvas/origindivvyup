import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '../components/ApperIcon';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
      <motion.div 
        className="card max-w-md w-full mx-auto text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-center mb-6">
          <motion.div 
            className="p-4 rounded-full bg-surface-100 dark:bg-surface-800"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ 
              repeat: Infinity, 
              repeatType: "loop", 
              duration: 3,
              ease: "easeInOut"
            }}
          >
            <ApperIcon 
              name="FileQuestion" 
              className="w-16 h-16 text-primary" 
            />
          </motion.div>
        </div>
        
        <h1 className="text-3xl font-bold mb-2">Page Not Found</h1>
        <p className="text-surface-600 dark:text-surface-400 mb-8">
          Oops! We couldn't find the page you're looking for.
        </p>
        
        <Link 
          to="/" 
          className="btn btn-primary inline-flex items-center justify-center"
        >
          <ApperIcon name="Home" className="w-4 h-4 mr-2" />
          Back to Home
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;