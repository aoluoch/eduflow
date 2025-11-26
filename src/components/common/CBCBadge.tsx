import { CBCLevel } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';

interface CBCBadgeProps {
  level: CBCLevel;
}

export const CBCBadge = ({ level }: CBCBadgeProps) => {
  const getBadgeStyles = () => {
    switch (level) {
      case 'EE':
        return 'bg-grade-ee text-white';
      case 'ME':
        return 'bg-grade-me text-white';
      case 'BE':
        return 'bg-grade-be text-white';
    }
  };

  const getFullName = () => {
    switch (level) {
      case 'EE':
        return 'Exceeds Expectations';
      case 'ME':
        return 'Meets Expectations';
      case 'BE':
        return 'Below Expectations';
    }
  };

  return (
    <Badge className={getBadgeStyles()}>
      {level} - {getFullName()}
    </Badge>
  );
};
