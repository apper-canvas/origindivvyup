import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from './ApperIcon';
import { format } from 'date-fns';

const FilterBar = ({ 
  onFilterChange, 
  categories = [], 
  showDateFilter = true,
  showCategoryFilter = true,
  showSearchFilter = true,
  activeFilters = {} 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localFilters, setLocalFilters] = useState({
    startDate: activeFilters.startDate || '',
    endDate: activeFilters.endDate || '',
    category: activeFilters.category || '',
    searchTerm: activeFilters.searchTerm || '',
  });

  const handleFilterChange = (name, value) => {
    const updatedFilters = { ...localFilters, [name]: value };
    setLocalFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const clearFilter = (filterName) => {
    const updatedFilters = { ...localFilters, [filterName]: '' };
    setLocalFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      startDate: '',
      endDate: '',
      category: '',
      searchTerm: '',
    };
    setLocalFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  // Check if any filters are active
  const hasActiveFilters = Object.values(localFilters).some(value => value !== '');

  return (
    <div className="mb-6">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="btn btn-outline text-sm flex items-center gap-1.5"
        >
          <ApperIcon name="Filter" className="h-4 w-4" />
          Filters
          <ApperIcon name={isExpanded ? "ChevronUp" : "ChevronDown"} className="h-4 w-4" />
        </button>

        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-surface-600 dark:text-surface-400 hover:text-primary flex items-center gap-1"
          >
            <ApperIcon name="X" className="h-3.5 w-3.5" />
            Clear all filters
          </button>
        )}
      </div>

      {/* Active filter pills */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mb-3">
          {localFilters.startDate && (
            <div className="flex items-center gap-1 px-2 py-1 text-xs bg-surface-100 dark:bg-surface-800 rounded-full">
              <span>From: {format(new Date(localFilters.startDate), 'MMM d, yyyy')}</span>
              <button onClick={() => clearFilter('startDate')} className="text-surface-500 hover:text-surface-700">
                <ApperIcon name="X" className="h-3 w-3" />
              </button>
            </div>
          )}
          {localFilters.endDate && (
            <div className="flex items-center gap-1 px-2 py-1 text-xs bg-surface-100 dark:bg-surface-800 rounded-full">
              <span>To: {format(new Date(localFilters.endDate), 'MMM d, yyyy')}</span>
              <button onClick={() => clearFilter('endDate')} className="text-surface-500 hover:text-surface-700">
                <ApperIcon name="X" className="h-3 w-3" />
              </button>
            </div>
          )}
          {localFilters.category && (
            <div className="flex items-center gap-1 px-2 py-1 text-xs bg-surface-100 dark:bg-surface-800 rounded-full">
              <span>Category: {localFilters.category}</span>
              <button onClick={() => clearFilter('category')} className="text-surface-500 hover:text-surface-700">
                <ApperIcon name="X" className="h-3 w-3" />
              </button>
            </div>
          )}
          {localFilters.searchTerm && (
            <div className="flex items-center gap-1 px-2 py-1 text-xs bg-surface-100 dark:bg-surface-800 rounded-full">
              <span>Search: "{localFilters.searchTerm}"</span>
              <button onClick={() => clearFilter('searchTerm')} className="text-surface-500 hover:text-surface-700">
                <ApperIcon name="X" className="h-3 w-3" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Expandable filter section */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden bg-surface-50 dark:bg-surface-800 rounded-lg p-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {showDateFilter && (
                <>
                  <div>
                    <label htmlFor="startDate" className="label">Start Date</label>
                    <input type="date" id="startDate" value={localFilters.startDate} onChange={(e) => handleFilterChange('startDate', e.target.value)} className="input" />
                  </div>
                  <div>
                    <label htmlFor="endDate" className="label">End Date</label>
                    <input type="date" id="endDate" value={localFilters.endDate} onChange={(e) => handleFilterChange('endDate', e.target.value)} className="input" />
                  </div>
                </>
              )}
              {showCategoryFilter && categories.length > 0 && (
                <div>
                  <label htmlFor="category" className="label">Category</label>
                  <select id="category" value={localFilters.category} onChange={(e) => handleFilterChange('category', e.target.value)} className="input">
                    <option value="">All Categories</option>
                    {categories.map((category, index) => (
                      <option key={index} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              )}
              {showSearchFilter && (
                <div className={`${(showDateFilter || (showCategoryFilter && categories.length > 0)) ? 'md:col-span-3' : ''}`}>
                  <label htmlFor="searchTerm" className="label">Search</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      id="searchTerm" 
                      value={localFilters.searchTerm} 
                      onChange={(e) => handleFilterChange('searchTerm', e.target.value)} 
                      placeholder="Search by description, person, etc." 
                      className="input pl-9"
                    />
                    <ApperIcon name="Search" className="absolute left-3 top-2.5 h-4 w-4 text-surface-400" />
                    {localFilters.searchTerm && (
                      <button 
                        onClick={() => clearFilter('searchTerm')} 
                        className="absolute right-3 top-2.5 text-surface-400 hover:text-surface-600"
                      >
                        <ApperIcon name="X" className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FilterBar;