import addSquare from '@/assets/icons/add-square.svg';
import { ChevronDown, ChevronUp } from 'lucide-react';

export const SidebarItem = ({ item: { icon, name }, isExpanded, hasChildren, isNested }) => {
  return (
    <>
      {isNested ? (
        <span className="item-bullet" />
      ) : (
        <span className="item-icon">
          <img className={`item-icon-image--${!icon ? 'sm' : 'lg'}`} src={icon || addSquare} alt={name} />
        </span>
      )}
      <span className="item-name">{name}</span>
      {hasChildren && (
        <span className="expand-icon">{isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</span>
      )}
    </>
  );
};
