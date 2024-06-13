import React, { useState } from 'react';
import styled from 'styled-components';
import MenuItem from './MenuItem';
import { AiOutlineSearch } from 'react-icons/ai';

const Navbar = styled.nav`
  background-color: #ffffff;
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const SearchIcon = styled(AiOutlineSearch)`
  font-size: 20px;
  cursor: pointer;
`;

const PopupSearch = styled.div`
  position: absolute;
  top: 60px; /* Adjust as needed */
  right: 20px;
  background-color: #ffffff;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
  display: ${({ visible }) => (visible ? 'block' : 'none')};
  z-index: 1000; /* Ensure it's above other content */
`;

const Place = styled.div`
  text-align: center;
  img {
    border-radius: 5px;
    margin-bottom: 20px;
  }
`;

const Container = styled.div`
  b, p {
    ${({ font }) => font && `font-family: ${font};` }
  }
`;

const FilterButtons = styled.div`
  margin-top: 10px;
  display: flex;
  justify-content: center;
`;

const FilterButton = styled.button`
  background-color: ${({ active }) => (active ? '#ffffff' : 'transparent')};
  color: ${({ active }) => (active ? '#000000' : '#000000')}; /* Change font color to black */
  border: none;
  border-radius: 20px;
  padding: 10px 20px;
  margin: 0 10px;
  cursor: pointer;
  outline: none;
  transition: background-color 0.3s ease-in-out, color 0.3s ease-in-out;

  &:hover {
    background-color: ${({ active }) => (active ? '#ffffff' : '#f0f0f0')};
    color: ${({ active }) => (active ? '#007bff' : '#000000')};
  }
`;

const MenuList = ({ place, shoppingCart = {}, onOrder, font = "", color = "" }) => {
  const [filter, setFilter] = useState('all'); // 'all', 'veg', 'nonveg'
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleFilterChange = (filter) => {
    setFilter(filter);
  };

  const toggleSearch = () => {
    setSearchVisible(!searchVisible);
  };

  const handleSearch = () => {
    const filteredItems = place.categories.reduce((acc, category) => {
      const items = category.menu_items.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      return [...acc, ...items];
    }, []);
    setSearchResults(filteredItems);
  };

  const handleItemClick = (item) => {
    // Implement your action when an item is clicked (e.g., add to cart)
    console.log(`Clicked on item: ${item.name}`);
    // Example: Add to cart
    onOrder(item);
    // Close search popup after item is clicked
    setSearchVisible(false);
    // Clear search query and results
    setSearchQuery('');
    setSearchResults([]);
  };

  return (
    <Container font={font}>
      <Navbar>
        <div>
          <b>{place.name}</b>
        </div>
        <SearchIcon onClick={toggleSearch} />
      </Navbar>

      <PopupSearch visible={searchVisible}>
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
        <ul>
          {searchResults.map(item => (
            <li key={item.id} onClick={() => handleItemClick(item)}>
              {item.name}
            </li>
          ))}
        </ul>
      </PopupSearch>

      <br></br>
      <br></br>
      <Place>
        <img src={place.image} width={400} height={200} alt="Restaurant" />
      </Place>
      <br></br>
      <FilterButtons>
        <FilterButton 
          onClick={() => handleFilterChange('all')}
          active={filter === 'all'}
        >
          All
        </FilterButton>
        <FilterButton 
          onClick={() => handleFilterChange('veg')}
          active={filter === 'veg'}
        >
          Veg
        </FilterButton>
        <FilterButton 
          onClick={() => handleFilterChange('nonveg')}
          active={filter === 'nonveg'}
        >
          Non-Veg
        </FilterButton>
      </FilterButtons>
      
      {place?.categories
        ?.filter(
          (category) => {
            if (filter === 'all') return true;
            return category.menu_items.some(item => item.diet === filter);
          }
        )
        .map((category) => (
          <div key={category.id} className="mt-5">
            <h4 className="mb-4">
              <b>{category.name}</b>
            </h4>
            {category.menu_items
              .filter((item) => item.is_available && (filter === 'all' || item.diet === filter))
              .map((item) => (
                <MenuItem 
                  key={item.id} 
                  item={{  
                    ...item,
                    quantity: shoppingCart[item.id]?.quantity,
                  }} 
                  onOrder={onOrder}
                  color={color}
                />
              ))
            }
          </div>
        ))
      }
    </Container>
  )
};

export default MenuList;
