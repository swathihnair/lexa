import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X } from 'lucide-react';

interface Filters {
  categories: string[];
  priceRange: [number, number];
  inStock: boolean;
}

interface ProductFiltersProps {
  categories: string[];
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  maxPrice: number;
}

const ProductFilters = ({ categories, filters, onFiltersChange, maxPrice }: ProductFiltersProps) => {
  const [localPriceRange, setLocalPriceRange] = useState(filters.priceRange);

  const handleCategoryChange = (category: string, checked: boolean) => {
    const updatedCategories = checked
      ? [...filters.categories, category]
      : filters.categories.filter(c => c !== category);
    
    onFiltersChange({
      ...filters,
      categories: updatedCategories,
    });
  };

  const handlePriceChange = (value: number[]) => {
    setLocalPriceRange([value[0], value[1]]);
    onFiltersChange({
      ...filters,
      priceRange: [value[0], value[1]],
    });
  };

  const handleInStockChange = (checked: boolean) => {
    onFiltersChange({
      ...filters,
      inStock: checked,
    });
  };

  const clearFilters = () => {
    const resetFilters: Filters = {
      categories: [],
      priceRange: [0, maxPrice],
      inStock: false,
    };
    setLocalPriceRange(resetFilters.priceRange);
    onFiltersChange(resetFilters);
  };

  const hasActiveFilters = 
    filters.categories.length > 0 || 
    filters.priceRange[0] > 0 || 
    filters.priceRange[1] < maxPrice || 
    filters.inStock;

  return (
    <div className="w-full lg:w-80 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Filters</h2>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-primary hover:text-primary/80"
          >
            <X className="mr-1 h-4 w-4" />
            Clear All
          </Button>
        )}
      </div>

      {/* Categories */}
      <Card className="filter-section">
        <CardHeader>
          <CardTitle className="text-lg">Categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {categories.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={category}
                checked={filters.categories.includes(category)}
                onCheckedChange={(checked) => 
                  handleCategoryChange(category, checked as boolean)
                }
              />
              <Label 
                htmlFor={category} 
                className="text-sm font-medium cursor-pointer"
              >
                {category}
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Price Range */}
      <Card className="filter-section">
        <CardHeader>
          <CardTitle className="text-lg">Price Range</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="px-2">
            <Slider
              value={localPriceRange}
              onValueChange={handlePriceChange}
              max={maxPrice}
              min={0}
              step={100}
              className="w-full"
            />
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>₹{localPriceRange[0].toLocaleString()}</span>
            <span>₹{localPriceRange[1].toLocaleString()}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="min-price" className="text-xs">Min</Label>
              <Input
                id="min-price"
                type="number"
                value={localPriceRange[0]}
                onChange={(e) => {
                  const value = Math.max(0, parseInt(e.target.value) || 0);
                  handlePriceChange([value, localPriceRange[1]]);
                }}
                className="text-xs"
              />
            </div>
            <div>
              <Label htmlFor="max-price" className="text-xs">Max</Label>
              <Input
                id="max-price"
                type="number"
                value={localPriceRange[1]}
                onChange={(e) => {
                  const value = Math.min(maxPrice, parseInt(e.target.value) || maxPrice);
                  handlePriceChange([localPriceRange[0], value]);
                }}
                className="text-xs"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Availability */}
      <Card className="filter-section">
        <CardHeader>
          <CardTitle className="text-lg">Availability</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="in-stock"
              checked={filters.inStock}
              onCheckedChange={handleInStockChange}
            />
            <Label htmlFor="in-stock" className="text-sm font-medium cursor-pointer">
              In Stock Only
            </Label>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductFilters;