import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from './ApperIcon';
import { format } from 'date-fns';
import FilterBar from './FilterBar';

// Sample data for demo purposes
const initialGroups = [
  { id: 'g1', name: 'Roommates', description: 'Apartment expenses', members: ['John', 'Sara', 'Miguel'] },
  { id: 'g2', name: 'Trip to Paris', description: 'Summer vacation', members: ['John', 'Lisa', 'Tom', 'Emily'] },
];

const initialExpenses = [
  { 
    id: 'e1', 
    description: 'Groceries', 
    amount: 89.75, 
    currency: 'USD',
    paidBy: 'John',
    groupId: 'g1',
    date: new Date(2023, 10, 15),
    category: 'Food',
    splitType: 'equal',
    perPersonAmount: 29.92
  },
  { 
    id: 'e2', 
    description: 'Electricity Bill', 
    amount: 142.30, 
    currency: 'USD',
    paidBy: 'Sara',
    groupId: 'g1',
    date: new Date(2023, 10, 18),
    category: 'Utilities',
    splitType: 'equal',
    perPersonAmount: 47.43
  },
  { 
    id: 'e3', 
    description: 'Hotel Room', 
    amount: 850.00, 
    currency: 'EUR',
    paidBy: 'Lisa',
    groupId: 'g2',
    date: new Date(2023, 7, 12),
    category: 'Accommodation',
    splitType: 'equal',
    perPersonAmount: 212.50
  },
];

// Initial balances calculation based on expenses
const calculateBalances = (expenses) => {
  const balances = {};
  
  expenses.forEach(expense => {
    const { groupId, paidBy, amount, perPersonAmount } = expense;
    
    // Get members from the group this expense belongs to
    const group = initialGroups.find(g => g.id === groupId);
    if (!group) return;
    
    const members = group.members;
    
    // Initialize balance entries if they don't exist
    members.forEach(member => {
      if (!balances[groupId]) balances[groupId] = {};
      if (!balances[groupId][member]) balances[groupId][member] = 0;
    });
    
    // The person who paid gets credited the amount paid minus their share
    balances[groupId][paidBy] += amount - perPersonAmount;
    
    // Everyone else owes their share
    members.forEach(member => {
      if (member !== paidBy) {
        balances[groupId][member] -= perPersonAmount;
      }
    });
  });
  
  return balances;
};

const initialBalances = calculateBalances(initialExpenses);

const MainFeature = () => {
  const [activeGroupId, setActiveGroupId] = useState(initialGroups[0]?.id || '');
  const [groups, setGroups] = useState(initialGroups);
  const [expenses, setExpenses] = useState(initialExpenses);
  const [balances, setBalances] = useState(initialBalances);
  const [expenseFilters, setExpenseFilters] = useState({
    startDate: '',
    endDate: '',
    category: '',
    searchTerm: '',
  });
  
  const [view, setView] = useState('expenses'); // 'expenses' or 'balances'
  
  // Form state for adding new expense
  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: '',
    paidBy: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    category: 'Other',
    splitType: 'equal',
  });
  
  const [showAddExpenseForm, setShowAddExpenseForm] = useState(false);

  // Get active group
  const activeGroup = groups.find(g => g.id === activeGroupId) || groups[0] || {};
  
  // Get expenses for active group with filters
  const groupExpenses = expenses.filter(e => {
    // Base filter - group membership
    if (e.groupId !== activeGroupId) return false;
    
    // Date filters
    if (expenseFilters.startDate && new Date(e.date) < new Date(expenseFilters.startDate)) return false;
    if (expenseFilters.endDate && new Date(e.date) > new Date(`${expenseFilters.endDate}T23:59:59`)) return false;
    
    // Category filter
    if (expenseFilters.category && e.category !== expenseFilters.category) return false;
    
    // Search filter
    if (expenseFilters.searchTerm) {
      const searchLower = expenseFilters.searchTerm.toLowerCase();
      const expenseText = `${e.description} ${e.paidBy} ${e.category}`.toLowerCase();
      if (!expenseText.includes(searchLower)) return false;
    }
    
    return true;
  });

  // Update balances when expenses change
  useEffect(() => {
    setBalances(calculateBalances(expenses));
  }, [expenses]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewExpense(prev => ({ ...prev, [name]: value }));
  };

  // Add new expense
  const handleAddExpense = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!newExpense.description || !newExpense.amount || !newExpense.paidBy) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    const amount = parseFloat(newExpense.amount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    
    // Calculate per person amount based on split type
    const memberCount = activeGroup.members.length;
    const perPersonAmount = amount / memberCount;
    
    // Create new expense
    const newExpenseItem = {
      id: 'e' + (expenses.length + 1),
      description: newExpense.description,
      amount,
      currency: 'USD', // Hardcoded for demo
      paidBy: newExpense.paidBy,
      groupId: activeGroupId,
      date: new Date(newExpense.date),
      category: newExpense.category,
      splitType: newExpense.splitType,
      perPersonAmount
    };
    
    // Add to expenses
    setExpenses(prev => [...prev, newExpenseItem]);
    
    // Reset form
    setNewExpense({
      description: '',
      amount: '',
      paidBy: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      category: 'Other',
      splitType: 'equal',
    });
    
    // Hide form
    setShowAddExpenseForm(false);
    
    // Show success message
    toast.success('Expense added successfully');
  };
  
  // Handle expense filters change
  const handleExpenseFilterChange = (newFilters) => {
    setExpenseFilters(newFilters);
  };

  // Get balances for active group
  const groupBalances = balances[activeGroupId] || {};

  // Generate settlement plan
  const generateSettlementPlan = () => {
    const debts = [];
    const credits = [];
    
    // Separate members into debtors and creditors
    Object.entries(groupBalances).forEach(([member, balance]) => {
      if (balance < 0) {
        debts.push({ member, amount: Math.abs(balance) });
      } else if (balance > 0) {
        credits.push({ member, amount: balance });
      }
    });
    
    // Sort by amount (descending)
    debts.sort((a, b) => b.amount - a.amount);
    credits.sort((a, b) => b.amount - a.amount);
    
    const settlements = [];
    
    // Match debtors with creditors
    while (debts.length > 0 && credits.length > 0) {
      const debt = debts[0];
      const credit = credits[0];
      
      const amountToSettle = Math.min(debt.amount, credit.amount);
      
      settlements.push({
        from: debt.member,
        to: credit.member,
        amount: parseFloat(amountToSettle.toFixed(2))
      });
      
      // Update remaining amounts
      debt.amount -= amountToSettle;
      credit.amount -= amountToSettle;
      
      // Remove entries with zero balance
      if (debt.amount < 0.01) debts.shift();
      if (credit.amount < 0.01) credits.shift();
    }
    
    return settlements;
  };
  
  const settlementPlan = generateSettlementPlan();
  
  // Get unique categories for the filter dropdown
  const uniqueCategories = [...new Set(
    expenses
      .filter(e => e.groupId === activeGroupId)
      .map(e => e.category)
  )];
  
  // Check if there are any active filters
  const hasActiveFilters = Object.values(expenseFilters).some(val => val !== '');

  return (
    <div className="max-w-5xl mx-auto">
      {/* Group Selection */}
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            {activeGroup.name || 'Select a Group'}
          </h1>
          <p className="text-surface-600 dark:text-surface-400">
            {activeGroup.description}
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {groups.map(group => (
            <button
              key={group.id}
              onClick={() => setActiveGroupId(group.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeGroupId === group.id
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700'
              }`}
            >
              {group.name}
            </button>
          ))}
        </div>
      </div>
      
      {/* Members Display */}
      <div className="flex flex-wrap gap-2 mb-6">
        <div className="text-sm font-medium text-surface-600 dark:text-surface-400 mr-1">
          Members:
        </div>
        {activeGroup.members?.map((member, index) => (
          <div 
            key={index}
            className="flex items-center bg-surface-100 dark:bg-surface-800 px-3 py-1 rounded-full text-sm"
          >
            <span className="w-5 h-5 rounded-full bg-primary-light flex items-center justify-center text-xs text-white mr-1.5">
              {member.charAt(0)}
            </span>
            {member}
          </div>
        ))}
      </div>
      
      {/* View Tabs */}
      <div className="flex border-b border-surface-200 dark:border-surface-700 mb-6">
        <button
          className={`px-4 py-2 font-medium text-sm ${
            view === 'expenses'
              ? 'text-primary border-b-2 border-primary'
              : 'text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-surface-100'
          }`}
          onClick={() => setView('expenses')}
        >
          Expenses
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm ${
            view === 'balances'
              ? 'text-primary border-b-2 border-primary'
              : 'text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-surface-100'
          }`}
          onClick={() => setView('balances')}
        >
          Balances & Settlements
        </button>
      </div>
      
      {/* Expenses View */}
      {view === 'expenses' && (
        <>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Expenses</h2>
            <button
              onClick={() => setShowAddExpenseForm(!showAddExpenseForm)}
              className="btn btn-primary inline-flex items-center"
            >
              <ApperIcon name={showAddExpenseForm ? "X" : "Plus"} className="h-4 w-4 mr-1" />
              {showAddExpenseForm ? 'Cancel' : 'Add Expense'}
            </button>
          </div>

          {/* Add Expense Form */}
          {!showAddExpenseForm && (
            <FilterBar 
              onFilterChange={handleExpenseFilterChange}
              categories={uniqueCategories}
              activeFilters={expenseFilters}
              showDateFilter={true}
              showCategoryFilter={true}
            />
          )}
          <AnimatePresence>
            {showAddExpenseForm && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden mb-6"
              >
                <form onSubmit={handleAddExpense} className="card">
                  <h3 className="text-lg font-semibold mb-4">Add New Expense</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="description" className="label">Description *</label>
                      <input
                        type="text"
                        id="description"
                        name="description"
                        className="input"
                        value={newExpense.description}
                        onChange={handleInputChange}
                        placeholder="What was this expense for?"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="amount" className="label">Amount *</label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-surface-500">$</span>
                        <input
                          type="number"
                          id="amount"
                          name="amount"
                          className="input pl-7"
                          value={newExpense.amount}
                          onChange={handleInputChange}
                          placeholder="0.00"
                          min="0.01"
                          step="0.01"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="paidBy" className="label">Paid By *</label>
                      <select
                        id="paidBy"
                        name="paidBy"
                        className="input"
                        value={newExpense.paidBy}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select who paid</option>
                        {activeGroup.members?.map((member, index) => (
                          <option key={index} value={member}>{member}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="date" className="label">Date</label>
                      <input
                        type="date"
                        id="date"
                        name="date"
                        className="input"
                        value={newExpense.date}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="category" className="label">Category</label>
                      <select
                        id="category"
                        name="category"
                        className="input"
                        value={newExpense.category}
                        onChange={handleInputChange}
                      >
                        <option value="Food">Food</option>
                        <option value="Utilities">Utilities</option>
                        <option value="Transportation">Transportation</option>
                        <option value="Accommodation">Accommodation</option>
                        <option value="Entertainment">Entertainment</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="splitType" className="label">Split Type</label>
                      <select
                        id="splitType"
                        name="splitType"
                        className="input"
                        value={newExpense.splitType}
                        onChange={handleInputChange}
                      >
                        <option value="equal">Split Equally</option>
                        {/* More split options could be added here in a full implementation */}
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <button type="submit" className="btn btn-primary">
                      Add Expense
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Expenses List */}
          <div className="space-y-4">
            {groupExpenses.length === 0 ? (
              <div className="card text-center py-8">
                <ApperIcon name="ReceiptText" className="h-12 w-12 mx-auto text-surface-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  {hasActiveFilters 
                    ? "No expenses match your filter criteria" 
                    : "No expenses yet"
                  }
                </h3>
                {hasActiveFilters && (
                  <button onClick={() => setExpenseFilters({startDate: '', endDate: '', category: '', searchTerm: ''})} className="text-primary mb-4">Clear all filters</button>
                )}
                <p className="text-surface-500 dark:text-surface-400 mb-4">
                  Add your first expense to start tracking
                </p>
                <button
                  onClick={() => setShowAddExpenseForm(true)}
                  className="btn btn-primary inline-flex items-center mx-auto"
                >
                  <ApperIcon name="Plus" className="h-4 w-4 mr-1" />
                  Add Expense
                </button>
              </div>
            ) : (
              groupExpenses.map((expense) => (
                <motion.div
                  key={expense.id}
                  className="card"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start">
                        <div className="mr-3">
                          <div className="p-2 bg-surface-100 dark:bg-surface-800 rounded-lg">
                            <ApperIcon name="Receipt" className="h-5 w-5 text-primary" />
                          </div>
                        </div>
                        <div>
                          <h3 className="font-medium text-lg">{expense.description}</h3>
                          <div className="text-sm text-surface-600 dark:text-surface-400">
                            {format(expense.date, 'MMM d, yyyy')} • {expense.category}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end">
                      <div className="font-semibold text-lg">
                        ${expense.amount.toFixed(2)}
                      </div>
                      <div className="text-sm text-surface-600 dark:text-surface-400">
                        Paid by {expense.paidBy}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-surface-200 dark:border-surface-700">
                    <div className="text-sm text-surface-600 dark:text-surface-400 mb-2">
                      Split {expense.splitType}ly • ${expense.perPersonAmount.toFixed(2)} per person
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {activeGroup.members?.map((member, idx) => (
                        <div 
                          key={idx}
                          className={`text-xs px-2 py-1 rounded-full ${
                            member === expense.paidBy
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : 'bg-surface-100 dark:bg-surface-800'
                          }`}
                        >
                          {member} {member === expense.paidBy && '(paid)'}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </>
      )}
      
      {/* Balances View */}
      {view === 'balances' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Balances */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Current Balances</h3>
              
              {Object.keys(groupBalances).length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-surface-500 dark:text-surface-400">
                    No balances to display yet. Add some expenses first.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {Object.entries(groupBalances).map(([member, balance], idx) => (
                    <div 
                      key={idx}
                      className="flex items-center justify-between py-2 border-b border-surface-200 dark:border-surface-700 last:border-0"
                    >
                      <div className="flex items-center">
                        <span className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center text-sm text-white mr-3">
                          {member.charAt(0)}
                        </span>
                        <span>{member}</span>
                      </div>
                      <div className={`font-medium ${
                        balance > 0 
                          ? 'text-green-600 dark:text-green-400' 
                          : balance < 0 
                            ? 'text-red-600 dark:text-red-400' 
                            : 'text-surface-600 dark:text-surface-400'
                      }`}>
                        {balance > 0 && '+'}
                        ${balance.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Settlement Plan */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Settlement Plan</h3>
              
              {settlementPlan.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-surface-500 dark:text-surface-400">
                    All settled up! No payments needed.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {settlementPlan.map((settlement, idx) => (
                    <div 
                      key={idx}
                      className="flex items-center p-3 bg-surface-50 dark:bg-surface-800 rounded-lg"
                    >
                      <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center text-sm text-red-600 dark:text-red-200 mr-2">
                        {settlement.from.charAt(0)}
                      </div>
                      <div className="flex-1 mx-2">
                        <div className="text-sm">{settlement.from}</div>
                        <div className="text-xs text-surface-500 dark:text-surface-400">pays</div>
                      </div>
                      <div className="font-semibold mx-2">${settlement.amount.toFixed(2)}</div>
                      <ApperIcon name="ArrowRight" className="w-4 h-4 mx-2 text-surface-400" />
                      <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-sm text-green-600 dark:text-green-200 mr-2">
                        {settlement.to.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm">{settlement.to}</div>
                        <div className="text-xs text-surface-500 dark:text-surface-400">receives</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Summary Chart - In a full implementation, this would be a proper chart */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Group Summary</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div className="bg-surface-50 dark:bg-surface-800 p-4 rounded-lg text-center">
                <div className="text-sm text-surface-500 dark:text-surface-400 mb-1">Total Expenses</div>
                <div className="text-2xl font-bold">
                  ${groupExpenses.reduce((sum, expense) => sum + expense.amount, 0).toFixed(2)}
                </div>
              </div>
              
              <div className="bg-surface-50 dark:bg-surface-800 p-4 rounded-lg text-center">
                <div className="text-sm text-surface-500 dark:text-surface-400 mb-1">Expenses Count</div>
                <div className="text-2xl font-bold">{groupExpenses.length}</div>
              </div>
              
              <div className="bg-surface-50 dark:bg-surface-800 p-4 rounded-lg text-center">
                <div className="text-sm text-surface-500 dark:text-surface-400 mb-1">Average per Person</div>
                <div className="text-2xl font-bold">
                  ${activeGroup.members?.length ? 
                    (groupExpenses.reduce((sum, expense) => sum + expense.amount, 0) / activeGroup.members.length).toFixed(2) 
                    : '0.00'}
                </div>
              </div>
            </div>
            
            <div className="h-48 bg-surface-50 dark:bg-surface-800 rounded-lg flex items-center justify-center">
              <p className="text-surface-500 dark:text-surface-400">
                Expense breakdown chart would appear here in full implementation
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MainFeature;