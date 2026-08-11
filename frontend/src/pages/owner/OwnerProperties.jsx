import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Building2,
  MapPin,
  Loader2,
  Search,
  Bed,
  Bath,
  Square,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import PropertyPreviewDrawer from '@/components/admin/PropertyPreviewDrawer';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const OwnerProperties = () => {
  const { user } = useAuth();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [previewPropertyId, setPreviewPropertyId] = useState(null);

  const fetchProperties = useCallback(async () => {
    if (!user?.linked_id) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${BACKEND_URL}/api/owners/${user.linked_id}/dashboard`
      );
      if (response.ok) {
        const data = await response.json();
        setProperties(data.properties || []);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.linked_id]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const filteredProperties = properties.filter((property) => {
    const matchesSearch =
      property.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.location?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || property.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user?.linked_id) {
    return (
      <div className="text-center py-12">
        <Building2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-xl font-semibold">Account Not Linked</h2>
        <p className="text-muted-foreground">
          Please contact admin to link your owner profile.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">My Properties</h1>

      <Card>
        <CardContent className="p-4 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" />
            <Input
              placeholder="Search properties..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="rented">Rented</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProperties.map((property) => (
          <Card
            key={property.id}
            className="cursor-pointer"
            onClick={() => setPreviewPropertyId(property.id)}
          >
            <CardContent className="p-4 space-y-2">
              <h3 className="font-semibold">{property.title}</h3>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {property.location}
              </p>
              <div className="flex gap-3 text-sm text-muted-foreground">
                <span><Bed className="w-4 h-4 inline" /> {property.beds}</span>
                <span><Bath className="w-4 h-4 inline" /> {property.baths}</span>
                <span><Square className="w-4 h-4 inline" /> {property.area}</span>
              </div>
              <p className="font-bold text-primary">₹{property.price}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <PropertyPreviewDrawer
        propertyId={previewPropertyId}
        isOpen={!!previewPropertyId}
        onClose={() => setPreviewPropertyId(null)}
      />
    </div>
  );
};

export default OwnerProperties;