import React, { useState, useRef, ChangeEvent, useEffect, KeyboardEvent } from 'react';

const BackendPage: React.FC = () => {
    const [inputValue, setInputValue] = useState<string>('');
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const [menuPosition, setMenuPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
    const [isPlusClicked, setIsPlusClicked] = useState<boolean>(false);
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [dragStartY, setDragStartY] = useState<number>(0);
    const [positionY, setPositionY] = useState<number>(0);
    const [selectedMenuItem, setSelectedMenuItem] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { value, selectionStart } = event.target;
        setInputValue(value);

        if (value.startsWith('/')) {
            openMenuBelow(selectionStart);
            setIsPlusClicked(false);
        } else {
            setIsMenuOpen(false);
        }
    };

    const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && inputValue.startsWith('/')) {
            const searchTerm = inputValue.slice(1).toLowerCase();
            const menuItems = ['text', 'text-area', 'select'];
            const matchingItem = menuItems.find(item => item.toLowerCase() === searchTerm);
            if (matchingItem) {
                setSelectedMenuItem(matchingItem);
                setIsMenuOpen(false);
                setInputValue('');
            }
        }
    };

    const openMenuBelow = (cursorPosition: number | null) => {
        setIsMenuOpen(true);
        if (containerRef.current && inputRef.current) {
            const containerRect = containerRef.current.getBoundingClientRect();
            const inputRect = inputRef.current.getBoundingClientRect();
            const inputValueBeforeCursor = inputValue.slice(0, cursorPosition ?? 0);
            const menuTop = inputRect.bottom - containerRect.top + 5;
            const menuLeft = inputRect.left - containerRect.left + inputValueBeforeCursor.length * 7;
            setMenuPosition({ top: menuTop, left: menuLeft });
        }
    };

    const openMenuAbove = () => {
        setIsMenuOpen(true);
        setIsPlusClicked(true);
        if (containerRef.current && inputRef.current) {
            const containerRect = containerRef.current.getBoundingClientRect();
            const inputRect = inputRef.current.getBoundingClientRect();
            const menuTop = inputRect.top - containerRect.top - 5;
            const menuLeft = inputRect.left - containerRect.left;
            setMenuPosition({ top: menuTop, left: menuLeft });
        }
    };

    const handlePlusClick = () => {
        openMenuAbove();
        inputRef.current?.focus();
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        setDragStartY(e.clientY - positionY);
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (isDragging) {
            const newY = e.clientY - dragStartY;
            setPositionY(newY);
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, dragStartY]);

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <div
                ref={containerRef}
                style={{
                    position: 'absolute',
                    left: '50%',
                    top: `${positionY}px`,
                    transform: 'translateX(-50%)',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <button
                        style={{
                            marginRight: '10px',
                            fontSize: '20px',
                            cursor: 'ns-resize',
                            userSelect: 'none',
                        }}
                        onMouseDown={handleMouseDown}
                    >
                        ⠿
                    </button>
                    <button
                        onClick={handlePlusClick}
                        style={{ marginRight: '10px', cursor: 'pointer', background: 'none', border: 'none', fontSize: '20px' }}
                    >
                        +
                    </button>
                    <input
                        type="text"
                        ref={inputRef}
                        value={inputValue}
                        onChange={handleChange}
                        onKeyDown={handleKeyPress}
                        placeholder="Type / or click + to open menu..."
                        style={{ width: '300px', padding: '10px' }}
                    />
                </div>
                {isMenuOpen && (
                    <div className="menu" style={{
                        position: 'absolute',
                        top: isPlusClicked ? `${menuPosition.top}px` : `${menuPosition.top}px`,
                        left: `${menuPosition.left}px`,
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        padding: '10px',
                        backgroundColor: 'white',
                        zIndex: 1000
                    }}>
                        <MenuBar value={inputValue} isPlusClicked={isPlusClicked} />
                    </div>
                )}
                {selectedMenuItem && (
                    <div style={{ marginTop: '20px' }}>
                        Selected Menu Item: <strong>{selectedMenuItem}</strong>
                    </div>
                )}
            </div>
        </div>
    );
};

const MenuBar: React.FC<{ value: string; isPlusClicked: boolean }> = ({ value, isPlusClicked }) => {
    const [menuItems] = useState<string[]>(['text', 'text-area', 'select']);
    const [filteredMenuItems, setFilteredMenuItems] = useState<string[]>(menuItems);

    useEffect(() => {
        if (isPlusClicked) {
            setFilteredMenuItems(menuItems);
        } else if (value.startsWith('/')) {
            const searchTerm = value.slice(1).toLowerCase();
            if (searchTerm === '') {
                setFilteredMenuItems(menuItems);
            } else {
                const filteredItems = menuItems.filter(item =>
                    item.toLowerCase().startsWith(searchTerm)
                );
                setFilteredMenuItems(filteredItems);
            }
        }
    }, [value, menuItems, isPlusClicked]);

    return (
        <>
            {filteredMenuItems.map(menuItem => {
                let matchPart = '';
                let nonMatchPart = menuItem;
                if (!isPlusClicked && value.startsWith('/')) {
                    const searchTerm = value.slice(1);
                    matchPart = menuItem.slice(0, searchTerm.length);
                    nonMatchPart = menuItem.slice(searchTerm.length);
                }
                return (
                    <div key={menuItem}>
                        <strong>{matchPart}</strong>{nonMatchPart}
                    </div>
                );
            })}
        </>
    );
};

export default BackendPage;
