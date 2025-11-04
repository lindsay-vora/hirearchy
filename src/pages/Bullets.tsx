import React, { useState } from 'react';
import PageHeader from '@/components/PageHeader';
import { Plus, Star, Edit, Trash2, Copy } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { Bullet } from '@/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import TagBadge from '@/components/TagBadge';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const Bullets: React.FC = () => {
  const { data, updateData } = useData();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');

  const handleToggleFavorite = (bulletId: string) => {
    const updatedBullets = data.bullets.map((b) =>
      b.id === bulletId ? { ...b, isFavorite: !b.isFavorite } : b
    );
    updateData({ bullets: updatedBullets });
  };

  const handleDeleteBullet = (bulletId: string) => {
    const updatedBullets = data.bullets.filter((b) => b.id !== bulletId);
    updateData({ bullets: updatedBullets });
    toast({ title: 'Bullet deleted successfully' });
  };

  const filteredBullets = data.bullets.filter(
    (bullet) =>
      bullet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bullet.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRatingColor = (rating?: string) => {
    switch (rating) {
      case 'strong':
        return 'text-success';
      case 'weak':
        return 'text-destructive';
      case 'needs-revision':
        return 'text-warning';
      default:
        return '';
    }
  };

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Bullet Library"
        description="Manage your experience bullets with tags and ratings"
        action={{
          label: 'New Bullet',
          icon: Plus,
          onClick: () => {},
        }}
      />

      <div className="flex-1 overflow-auto p-8">
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search bullets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md px-4 py-2 border border-input rounded-lg"
          />
        </div>

        <div className="space-y-4">
          {filteredBullets.map((bullet) => (
            <Card key={bullet.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{bullet.name}</h3>
                    {bullet.rating && (
                      <Badge
                        variant="outline"
                        className={getRatingColor(bullet.rating)}
                      >
                        {bullet.rating}
                      </Badge>
                    )}
                  </div>
                  {bullet.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {bullet.tags.map((tagId) => {
                        const tag = data.tags.find((t) => t.id === tagId);
                        return tag ? (
                          <TagBadge key={tagId} label={tag.name} color={tag.color} />
                        ) : null;
                      })}
                    </div>
                  )}
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleToggleFavorite(bullet.id)}
                  >
                    <Star
                      className={cn(
                        'h-4 w-4',
                        bullet.isFavorite && 'fill-warning text-warning'
                      )}
                    />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteBullet(bullet.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground">{bullet.content}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Updated: {new Date(bullet.updatedAt).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredBullets.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <h3 className="text-lg font-semibold mb-2">No bullets found</h3>
            <p className="text-muted-foreground">
              {searchTerm
                ? 'Try adjusting your search'
                : 'Create your first bullet to get started'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Bullets;
