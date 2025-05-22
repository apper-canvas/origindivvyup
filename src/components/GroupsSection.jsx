import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from './ApperIcon';

const GroupsSection = ({ groups, setGroups, activeGroupId, setActiveGroupId }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    members: ['']
  });

  // Open modal for creating a new group
  const handleAddGroup = () => {
    setEditingGroup(null);
    setFormData({
      name: '',
      description: '',
      members: ['']
    });
    setShowModal(true);
  };

  // Open modal for editing an existing group
  const handleEditGroup = (group) => {
    setEditingGroup(group);
    setFormData({
      name: group.name,
      description: group.description,
      members: [...group.members]
    });
    setShowModal(true);
  };

  // Delete a group with confirmation
  const handleDeleteGroup = (groupId) => {
    if (confirm('Are you sure you want to delete this group? All associated expenses will be deleted.')) {
      const updatedGroups = groups.filter(group => group.id !== groupId);
      
      // If we're deleting the active group, select another one
      if (groupId === activeGroupId && updatedGroups.length > 0) {
        setActiveGroupId(updatedGroups[0].id);
      }
      
      setGroups(updatedGroups);
      toast.success('Group deleted successfully');
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle member input changes
  const handleMemberChange = (index, value) => {
    const updatedMembers = [...formData.members];
    updatedMembers[index] = value;
    setFormData({
      ...formData,
      members: updatedMembers
    });
  };

  // Add a new empty member field
  const handleAddMember = () => {
    setFormData({
      ...formData,
      members: [...formData.members, '']
    });
  };

  // Remove a member field
  const handleRemoveMember = (index) => {
    if (formData.members.length <= 1) return; // Keep at least one member
    
    const updatedMembers = [...formData.members];
    updatedMembers.splice(index, 1);
    setFormData({
      ...formData,
      members: updatedMembers
    });
  };

  // Save group (create new or update existing)
  const handleSaveGroup = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name.trim()) {
      toast.error('Group name is required');
      return;
    }
    
    // Filter out empty member names and ensure uniqueness
    const validMembers = [...new Set(formData.members.filter(member => member.trim() !== ''))];
    
    if (validMembers.length === 0) {
      toast.error('At least one member is required');
      return;
    }
    
    if (editingGroup) {
      // Update existing group
      const updatedGroups = groups.map(group => 
        group.id === editingGroup.id 
          ? { 
              ...group, 
              name: formData.name,
              description: formData.description,
              members: validMembers
            } 
          : group
      );
      
      setGroups(updatedGroups);
      toast.success('Group updated successfully');
    } else {
      // Create new group
      const newGroup = {
        id: 'g' + (groups.length + 1),
        name: formData.name,
        description: formData.description,
        members: validMembers
      };
      
      setGroups([...groups, newGroup]);
      setActiveGroupId(newGroup.id);
      toast.success('Group created successfully');
    }
    
    // Close modal
    setShowModal(false);
  };

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Your Groups</h2>
        <button
          onClick={handleAddGroup}
          className="btn btn-primary inline-flex items-center"
        >
          <ApperIcon name="Plus" className="h-4 w-4 mr-1" />
          Create Group
        </button>
      </div>

      {/* Groups Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {groups.map((group) => (
          <motion.div
            key={group.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`group-card ${activeGroupId === group.id ? 'border-2 border-primary' : 'border border-surface-200 dark:border-surface-700'}`}
            onClick={() => setActiveGroupId(group.id)}
          >
            <div className="flex justify-between">
              <h3 className="font-semibold text-lg">{group.name}</h3>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={(e) => { e.stopPropagation(); handleEditGroup(group); }}
                  className="p-1 text-surface-600 hover:text-primary mr-1"
                  aria-label="Edit group"
                >
                  <ApperIcon name="Edit" className="h-4 w-4" />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); handleDeleteGroup(group.id); }}
                  className="p-1 text-surface-600 hover:text-red-500"
                  aria-label="Delete group"
                >
                  <ApperIcon name="Trash" className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <p className="text-surface-600 dark:text-surface-400 text-sm mb-4">
              {group.description || 'No description'}
            </p>
            
            <div className="mt-auto">
              <div className="text-sm text-surface-600 dark:text-surface-400 mb-2">
                {group.members.length} member{group.members.length !== 1 ? 's' : ''}
              </div>
              <div className="flex -space-x-2 overflow-hidden">
                {group.members.slice(0, 5).map((member, idx) => (
                  <div 
                    key={idx}
                    className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center text-xs text-white border-2 border-white dark:border-surface-800"
                    title={member}
                  >
                    {member.charAt(0)}
                  </div>
                ))}
                {group.members.length > 5 && (
                  <div className="w-8 h-8 rounded-full bg-surface-300 dark:bg-surface-700 flex items-center justify-center text-xs border-2 border-white dark:border-surface-800">
                    +{group.members.length - 5}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
        
        {/* Add Group Card */}
        <motion.div
          className="group-card border border-dashed border-surface-300 dark:border-surface-700 flex flex-col items-center justify-center cursor-pointer hover:bg-surface-100 dark:hover:bg-surface-800"
          onClick={handleAddGroup}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="w-12 h-12 rounded-full bg-surface-200 dark:bg-surface-700 flex items-center justify-center mb-2">
            <ApperIcon name="Plus" className="h-6 w-6 text-surface-600 dark:text-surface-400" />
          </div>
          <p className="text-surface-600 dark:text-surface-400 font-medium">Create New Group</p>
        </motion.div>
      </div>

      {/* Add/Edit Group Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-surface-800 rounded-xl shadow-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
            >
              <h3 className="text-xl font-semibold mb-4">{editingGroup ? 'Edit Group' : 'Create New Group'}</h3>
              
              <form onSubmit={handleSaveGroup}>
                <div className="mb-4">
                  <label htmlFor="name" className="label">Group Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="input"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter group name"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="description" className="label">Description</label>
                  <input
                    type="text"
                    id="description"
                    name="description"
                    className="input"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Brief description of the group"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="label">Members *</label>
                  {formData.members.map((member, index) => (
                    <div key={index} className="flex mb-2">
                      <input
                        type="text"
                        className="input"
                        value={member}
                        onChange={(e) => handleMemberChange(index, e.target.value)}
                        placeholder={`Member ${index + 1}`}
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveMember(index)}
                        className="ml-2 p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg"
                        disabled={formData.members.length <= 1}
                      >
                        <ApperIcon name="X" className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleAddMember}
                    className="text-primary text-sm flex items-center mt-2"
                  >
                    <ApperIcon name="Plus" className="h-4 w-4 mr-1" />
                    Add Member
                  </button>
                </div>
                
                <div className="flex justify-end gap-2 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="btn btn-outline"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                    {editingGroup ? 'Update Group' : 'Create Group'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GroupsSection;