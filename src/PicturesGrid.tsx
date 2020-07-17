import React, { useState } from 'react';
import { arrayMove, SortableContainer, SortableElement, SortEnd } from 'react-sortable-hoc';
import './pictureGrid.css';

const getRandomValue = () => {
  return Math.floor(Math.random() * 400) + 1;
};

let items1 = [1, 2, 3, 4, 5].map((val, index) => ({
  title: 'Item ' + index,
  index: index,
  id: Math.random(),
  imageSrc: `https://picsum.photos/180/180?random=${getRandomValue()}`
}));

const SortableComponent: React.FC = () => {
  const [items, setItems] = useState(items1);

  const onSortEnd = ({ oldIndex, newIndex }: SortEnd) => {
    console.log('sortEnd');
    setItems(arrayMove(items, oldIndex, newIndex));
  };

  const SortableItem = SortableElement(({ item }: any) => (
    <div className="item">
      <div className="inner-item">
        <img src={item.imageSrc} alt='' />
      </div>
    </div>
  ));

  const SortableList = SortableContainer(({ items }: any) => (
    <div className="container">
      {items.map((item: any, index: number) => (
        <SortableItem
          key={`${item.id}`}
          index={index}
          item={item}
        />
      ))}
      111
    </div>
  ));

  return (
    <SortableList
      items={items}
      onSortEnd={onSortEnd}
      axis="xy"
      helperClass="SortableHelper"
    />
  );
};

export { SortableComponent };

