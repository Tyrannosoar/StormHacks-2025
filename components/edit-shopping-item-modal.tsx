"use client";

import { useState, useEffect } from "react";
import { Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ShoppingItem } from "@/lib/types";
import { supabaseShoppingApi } from "@/lib/supabase-api";

interface EditShoppingItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: ShoppingItem | null;
  onSave: (updatedItem: ShoppingItem) => void;
  onDelete: (itemId: number) => void;
}

export function EditShoppingItemModal({ 
  isOpen, 
  onClose, 
  item, 
  onSave, 
  onDelete 
}: EditShoppingItemModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    plannedAmount: "",
    category: "",
    priority: "medium" as "high" | "medium" | "low"
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update form data when item changes
  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name,
        amount: item.amount,
        plannedAmount: item.plannedAmount,
        category: item.category,
        priority: item.priority
      });
    }
  }, [item]);

  const handleSave = async () => {
    if (!item) return;

    try {
      setIsLoading(true);
      setError(null);

      const updatedItem = {
        ...item,
        ...formData
      };

      const response = await supabaseShoppingApi.update(item.id, updatedItem);
      
      if (response.success && response.data) {
        onSave(response.data);
        onClose();
      } else {
        setError('Failed to update item');
      }
    } catch (err) {
      console.error('Error updating item:', err);
      setError('Failed to update item');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!item) return;

    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        setIsLoading(true);
        setError(null);

        const response = await supabaseShoppingApi.delete(item.id);
        
        if (response.success) {
          onDelete(item.id);
          onClose();
        } else {
          setError('Failed to delete item');
        }
      } catch (err) {
        console.error('Error deleting item:', err);
        setError('Failed to delete item');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const categories = [
    "Dairy", "Fruits", "Vegetables", "Meat", "Beverages", 
    "Grains", "Pantry", "Other"
  ];

  if (!item) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white border-gray-200 shadow-xl text-gray-900">
        <DialogHeader>
          <DialogTitle className="text-gray-900 text-xl">
            Edit Item
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Item Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-gray-700">
              Item Name
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter item name"
              className="w-full bg-white text-gray-900 border-gray-300"
            />
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-sm font-medium text-gray-700">
              Amount
            </Label>
            <Input
              id="amount"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              placeholder="e.g., 1L, 500g, 6 pcs"
              className="w-full bg-white text-gray-900 border-gray-300"
            />
          </div>

          {/* Planned Amount */}
          <div className="space-y-2">
            <Label htmlFor="plannedAmount" className="text-sm font-medium text-gray-700">
              Planned Amount
            </Label>
            <Input
              id="plannedAmount"
              value={formData.plannedAmount}
              onChange={(e) => setFormData({ ...formData, plannedAmount: e.target.value })}
              placeholder="e.g., 500ml, 300g, 3 pcs"
              className="w-full bg-white text-gray-900 border-gray-300"
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm font-medium text-gray-700">
              Category
            </Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value })}
            >
              <SelectTrigger className="w-full bg-white text-gray-900 border-gray-300">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-300">
                {categories.map((category) => (
                  <SelectItem key={category} value={category} className="text-gray-900">
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <Label htmlFor="priority" className="text-sm font-medium text-gray-700">
              Priority
            </Label>
            <Select
              value={formData.priority}
              onValueChange={(value: "high" | "medium" | "low") => 
                setFormData({ ...formData, priority: value })
              }
            >
              <SelectTrigger className="w-full bg-white text-gray-900 border-gray-300">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-300">
                <SelectItem value="high" className="text-gray-900">High Priority</SelectItem>
                <SelectItem value="medium" className="text-gray-900">Medium Priority</SelectItem>
                <SelectItem value="low" className="text-gray-900">Low Priority</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button
              onClick={handleSave}
              disabled={isLoading || !formData.name.trim()}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
            <Button
              onClick={handleDelete}
              variant="destructive"
              disabled={isLoading}
              className="flex-1"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
