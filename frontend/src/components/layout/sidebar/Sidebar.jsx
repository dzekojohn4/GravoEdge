import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './sidebar.css';
import { SidebarItem } from './SidebarItem';

const Sidebar = ({ title, items, className = '' }) => {
  const location = useLocation();
  const [activeItemId, setActiveItemId] = useState('');
  const [expandedItems, setExpandedItems] = useState({});

  useEffect(() => {
    const hash = location.hash.replace('#', '');
    if (hash) {
      setActiveItemId(hash);
      const element = document.getElementById(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }

    const currentPath = location.pathname;

    items.forEach((item) => {
      if (item.link === currentPath) {
        setActiveItemId(item.id);
      }
      if (item.children) {
        item.children.forEach((child) => {
          if (child.link === currentPath) {
            setActiveItemId(child.id);
            setExpandedItems((prev) => ({ ...prev, [item.id]: true }));
          }
        });
      }
    });
  }, [location, items]);

  const handleItemClick = (item) => {
    const elementId = item.link.replace('#', '');
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveItemId(item.id);
      window.history.pushState(null, '', item.link);
    }
    if (item.children) {
      setExpandedItems((prev) => ({
        ...prev,
        [item.id]: !prev[item.id],
      }));
    }
  };

  const renderSidebarItem = (item, level = 0) => {
    const isActive = activeItemId === item.id;
    const isExpanded = expandedItems[item.id];
    const hasChildren = item.children && item.children.length > 0;
    const itemClass = `sidebar-item ${isActive ? 'active' : ''} ${level > 0 ? 'nested' : ''}`;

    return (
      <div key={item.id} className="sidebar-item-wrapper">
        {item.link.startsWith('#') ? (
          <button onClick={() => handleItemClick(item)} className={itemClass}>
            <SidebarItem item={item} isExpanded={isExpanded} hasChildren={hasChildren} isNested={level > 0} />
          </button>
        ) : (
          <Link to={item.link} className={itemClass}>
            <SidebarItem item={item} isExpanded={isExpanded} hasChildren={hasChildren} isNested={level > 0} />
          </Link>
        )}

        {hasChildren && isExpanded && (
          <div className="nested-items">{item.children.map((child) => renderSidebarItem(child, level + 1))}</div>
        )}
      </div>
    );
  };

  return (
    <div className={`sidebar ${className}`}>
      <nav className="sidebar-nav">
        {title && (
          <div className="sidebar-title">
            <h2>{title}</h2>
          </div>
        )}
        {items.map((item) => renderSidebarItem(item))}
      </nav>
    </div>
  );
};

export default Sidebar;
