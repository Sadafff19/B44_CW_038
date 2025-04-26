import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const productsData = [
    { id: 1, name: "Organic Tomatoes", price: 3.99, category: "Vegetables", farm: "Green Valley Farm", rating: 4.5, image: "https://images.unsplash.com/photo-1582284540020-8acbe03f4924?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80", organic: true, local: true },
    { id: 2, name: "Organic Carrots", price: 2.49, category: "Vegetables", farm: "Root Down Farm", rating: 4.4, image: "https://images.unsplash.com/photo-1447175008436-054170c2e979?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80", organic: true, local: true },
    { id: 3, name: "Organic Spinach", price: 3.29, category: "Vegetables", farm: "Leafy Greens Co", rating: 4.3, image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80", organic: true, local: true },
    { id: 4, name: "Organic Potatoes", price: 2.19, category: "Vegetables", farm: "Underground Harvest", rating: 4.2, image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80", organic: true, local: true },
    { id: 5, name: "Organic Bell Peppers", price: 4.29, category: "Vegetables", farm: "Pepper Patch", rating: 4.6, image: "https://images.unsplash.com/photo-1700515268370-ac596e44dfe5?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", organic: true, local: true },
    { id: 6, name: "Organic Cucumbers", price: 1.99, category: "Vegetables", farm: "Crisp Creek Farm", rating: 4.3, image: "https://images.unsplash.com/photo-1687199129822-b54237c7bdb2?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", organic: true, local: true },
    { id: 7, name: "Organic Zucchini", price: 2.79, category: "Vegetables", farm: "Summer Squash Acres", rating: 4.1, image: "https://images.unsplash.com/photo-1687199126774-bc777f6d7c6e?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", organic: true, local: true },
    { id: 8, name: "Organic Kale", price: 3.49, category: "Vegetables", farm: "Leafy Greens Co", rating: 4.5, image: "https://images.unsplash.com/photo-1593352769539-d7be34841f51?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", organic: true, local: true },
    { id: 9, name: "Organic Broccoli", price: 2.99, category: "Vegetables", farm: "Brassica Brothers", rating: 4.2, image: "https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80", organic: true, local: true },
    { id: 10, name: "Organic Cauliflower", price: 3.19, category: "Vegetables", farm: "Brassica Brothers", rating: 4.0, image: "https://images.unsplash.com/photo-1568584952634-e9bb8a163e28?q=80&w=1472&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", organic: true, local: true },
    { id: 11, name: "Organic Green Beans", price: 3.79, category: "Vegetables", farm: "Beanstalk Farm", rating: 4.3, image: "https://images.unsplash.com/photo-1448293065296-c7e2e5b76ae9?q=80&w=1414&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", organic: true, local: true },
    { id: 12, name: "Organic Eggplant", price: 2.89, category: "Vegetables", farm: "Purple Patch", rating: 3.9, image: "https://images.unsplash.com/photo-1560951812-58e6bce53149?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", organic: true, local: true },
    { id: 13, name: "Organic Sweet Corn", price: 0.99, category: "Vegetables", farm: "Golden Fields", rating: 4.7, image: "https://images.unsplash.com/photo-1719229200950-4033763edf3d?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", organic: true, local: true },
    { id: 14, name: "Organic Asparagus", price: 5.49, category: "Vegetables", farm: "Spear Grass Farm", rating: 4.5, image: "https://plus.unsplash.com/premium_photo-1663127193043-7dd0772d826c?q=80&w=1472&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", organic: true, local: true },
    { id: 15, name: "Organic Brussels Sprouts", price: 4.99, category: "Vegetables", farm: "Mini Cabbage Co", rating: 4.0, image: "https://images.unsplash.com/photo-1615149503410-9a9ef865f9e9?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", organic: true, local: true },
    { id: 16, name: "Organic Radishes", price: 2.29, category: "Vegetables", farm: "Root Down Farm", rating: 4.1, image: "https://images.unsplash.com/photo-1716639468420-467d38a5854b?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", organic: true, local: true },
    { id: 17, name: "Organic Beets", price: 3.19, category: "Vegetables", farm: "Red Root Ranch", rating: 4.3, image: "https://images.unsplash.com/photo-1627738668643-1c166aecbf3d?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", organic: true, local: true },
    { id: 18, name: "Organic Celery", price: 2.99, category: "Vegetables", farm: "Crisp Creek Farm", rating: 3.8, image: "https://plus.unsplash.com/premium_photo-1723809783343-459c2047822b?q=80&w=1482&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", organic: true, local: true },
    { id: 19, name: "Organic Leeks", price: 3.49, category: "Vegetables", farm: "Allium Acres", rating: 4.2, image: "https://plus.unsplash.com/premium_photo-1725634974178-e2a67f295dd9?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", organic: true, local: true },
    { id: 20, name: "Organic Garlic", price: 1.99, category: "Vegetables", farm: "Allium Acres", rating: 4.8, image: "https://images.unsplash.com/photo-1741518077910-d5449aaa1636?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", organic: true, local: true },

    // Fruits (15 items)
    { id: 21, name: "Organic Apples", price: 2.99, category: "Fruits", farm: "Orchard Hill", rating: 4.6, image: "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80", organic: true, local: true },
    { id: 22, name: "Organic Strawberries", price: 5.99, category: "Fruits", farm: "Berry Good Farm", rating: 4.9, image: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80", organic: true, local: true },
    { id: 23, name: "Organic Blueberries", price: 6.49, category: "Fruits", farm: "Berry Good Farm", rating: 4.8, image: "https://images.unsplash.com/photo-1628104017776-50e38eb63041?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", organic: true, local: true },
    { id: 24, name: "Organic Raspberries", price: 7.29, category: "Fruits", farm: "Berry Good Farm", rating: 4.7, image: "https://images.unsplash.com/photo-1647441870734-2c8dedf22a41?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", organic: true, local: true },
    { id: 25, name: "Organic Bananas", price: 0.69, category: "Fruits", farm: "Tropical Grove", rating: 4.5, image: "https://images.unsplash.com/photo-1668762924684-a9753a0a887c?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", organic: true, local: false },
    { id: 26, name: "Organic Oranges", price: 3.29, category: "Fruits", farm: "Citrus Valley", rating: 4.4, image: "https://plus.unsplash.com/premium_photo-1683133436308-6defaada4dbf?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", organic: true, local: false },
    { id: 27, name: "Organic Grapes", price: 4.99, category: "Fruits", farm: "Vineyard View", rating: 4.6, image: "https://plus.unsplash.com/premium_photo-1663133578800-3e37bb962280?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", organic: true, local: true },
    { id: 28, name: "Organic Peaches", price: 3.99, category: "Fruits", farm: "Orchard Hill", rating: 4.7, image: "https://images.unsplash.com/photo-1568584477699-9f3b1722561c?q=80&w=1472&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", organic: true, local: true },
    { id: 29, name: "Organic Plums", price: 4.29, category: "Fruits", farm: "Orchard Hill", rating: 4.3, image: "https://plus.unsplash.com/premium_photo-1726718453334-f39cbdb8e07a?q=80&w=1454&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", organic: true, local: true },
    { id: 30, name: "Organic Pears", price: 3.49, category: "Fruits", farm: "Orchard Hill", rating: 4.2, image: "https://images.unsplash.com/photo-1743872322753-dbaa93f00f51?q=80&w=1474&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", organic: true, local: true },
    { id: 31, name: "Organic Cherries", price: 8.99, category: "Fruits", farm: "Cherry Lane", rating: 4.9, image: "https://images.unsplash.com/photo-1625246333208-a202eeaf1b0c?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", organic: true, local: true },
    { id: 32, name: "Organic Watermelon", price: 5.99, category: "Fruits", farm: "Melon Patch", rating: 4.7, image: "https://images.unsplash.com/photo-1658482199477-5b441d4e2321?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", organic: true, local: true },
    { id: 33, name: "Organic Cantaloupe", price: 4.49, category: "Fruits", farm: "Melon Patch", rating: 4.5, image: "https://images.unsplash.com/photo-1730413592694-d47a5e4d9164?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", organic: true, local: true },
    { id: 34, name: "Organic Pineapple", price: 3.99, category: "Fruits", farm: "Tropical Grove", rating: 4.3, image: "https://images.unsplash.com/photo-1635843129730-edb0ab07ee48?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", organic: true, local: false },
    { id: 35, name: "Organic Mangoes", price: 2.99, category: "Fruits", farm: "Tropical Grove", rating: 4.6, image: "https://images.unsplash.com/photo-1652102351785-0e95356d6e73?q=80&w=1457&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", organic: true, local: false },

    // Dairy (8 items)
    { id: 36, name: "Free Range Eggs (Dozen)", price: 6.49, category: "Dairy", farm: "Sunny Side Farm", rating: 4.8, image: "https://images.unsplash.com/photo-1587486913049-53fc88980cfc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80", organic: true, local: true },
    { id: 37, name: "Organic Whole Milk (1L)", price: 4.29, category: "Dairy", farm: "Happy Cow Dairy", rating: 4.5, image: "https://images.unsplash.com/photo-1517448931760-9bf4414148c5?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", organic: true, local: true },
    { id: 38, name: "Organic Butter (8oz)", price: 5.99, category: "Dairy", farm: "Happy Cow Dairy", rating: 4.6, image: "https://images.unsplash.com/photo-1573812461383-e5f8b759d12e?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", organic: true, local: true },
    { id: 39, name: "Organic Cheddar Cheese (8oz)", price: 7.49, category: "Dairy", farm: "Cheese Wheel Farm", rating: 4.7, image: "https://plus.unsplash.com/premium_photo-1723687215632-bd81b76d0df8?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", organic: true, local: true },
    { id: 40, name: "Organic Yogurt (32oz)", price: 6.99, category: "Dairy", farm: "Happy Cow Dairy", rating: 4.5, image: "https://images.unsplash.com/photo-1564149503905-7fef56abc1f2?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", organic: true, local: true },
    { id: 41, name: "Organic Sour Cream (16oz)", price: 4.49, category: "Dairy", farm: "Happy Cow Dairy", rating: 4.3, image: "https://images.unsplash.com/photo-1686998424941-9006770e7f3e?q=80&w=1474&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", organic: true, local: true },
    { id: 42, name: "Organic Cream Cheese (8oz)", price: 5.29, category: "Dairy", farm: "Cheese Wheel Farm", rating: 4.4, image: "https://images.unsplash.com/photo-1632200729570-1043effd1b77?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", organic: true, local: true },
    { id: 43, name: "Organic Heavy Cream (16oz)", price: 5.79, category: "Dairy", farm: "Happy Cow Dairy", rating: 4.2, image: "https://plus.unsplash.com/premium_photo-1723759365132-af57124362b0?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", organic: true, local: true },

    // Meat (7 items)
    { id: 44, name: "Grass-Fed Beef (1lb)", price: 9.99, category: "Meat", farm: "Prairie Ranch", rating: 4.7, image: "https://plus.unsplash.com/premium_photo-1726848206558-9d40da38508e?q=80&w=1459&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", organic: true, local: true },
    { id: 45, name: "Organic Chicken Breast (1lb)", price: 8.49, category: "Meat", farm: "Cluck & Feather", rating: 4.6, image: "https://images.unsplash.com/photo-1587593810167-a84920ea0781?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", organic: true, local: true },
    { id: 46, name: "Organic Ground Turkey (1lb)", price: 7.99, category: "Meat", farm: "Turkey Hollow", rating: 4.5, image: "https://plus.unsplash.com/premium_photo-1664391682453-546426dba581?q=80&w=1448&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", organic: true, local: true },
    { id: 47, name: "Organic Pork Chops (1lb)", price: 8.99, category: "Meat", farm: "Pig Pen Ranch", rating: 4.4, image: "https://images.unsplash.com/photo-1608502735811-0affbb61f260?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", organic: true, local: true },
    { id: 48, name: "Organic Bacon (12oz)", price: 9.49, category: "Meat", farm: "Pig Pen Ranch", rating: 4.8, image: "https://images.unsplash.com/photo-1623047437095-27418540c288?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", organic: true, local: true },
    { id: 49, name: "Organic Sausage (1lb)", price: 8.29, category: "Meat", farm: "Pig Pen Ranch", rating: 4.5, image: "https://images.unsplash.com/photo-1621800973389-768626d38a0c?q=80&w=1474&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", organic: true, local: true },
    { id: 50, name: "Organic Lamb Chops (1lb)", price: 14.99, category: "Meat", farm: "Sheep Meadow", rating: 4.7, image: "https://images.unsplash.com/photo-1708974140638-8554bc01690d?q=80&w=1448&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", organic: true, local: true },

    // Grains (5 items)
    { id: 51, name: "Organic Honey (12oz)", price: 7.99, category: "Grains", farm: "Busy Bee Apiary", rating: 4.9, image: "https://plus.unsplash.com/premium_photo-1726880614839-faa6caa3b3d4?q=80&w=1543&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", organic: true, local: true },
    { id: 52, name: "Organic Whole Wheat Flour (5lb)", price: 6.49, category: "Grains", farm: "Golden Fields", rating: 4.5, image: "https://images.unsplash.com/photo-1627485937980-221c88ac04f9?q=80&w=1483&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", organic: true, local: true },
    { id: 53, name: "Organic Brown Rice (2lb)", price: 4.99, category: "Grains", farm: "Rice Paddy", rating: 4.4, image: "https://images.unsplash.com/photo-1613045935265-265ff612e0e2?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", organic: true, local: false },
    { id: 54, name: "Organic Quinoa (16oz)", price: 8.29, category: "Grains", farm: "Andean Valley", rating: 4.6, image: "https://images.unsplash.com/photo-1598111388756-b2285cca0458?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", organic: true, local: false },
    { id: 55, name: "Organic Oats (32oz)", price: 5.49, category: "Grains", farm: "Golden Fields", rating: 4.5, image: "https://images.unsplash.com/photo-1598048851887-0263d4f43e73?q=80&w=1456&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", organic: true, local: true },

    // Herbs (5 items)
    { id: 56, name: "Organic Basil", price: 2.99, category: "Herbs", farm: "Herbal Haven", rating: 4.7, image: "https://images.unsplash.com/photo-1627740281562-3faaa5d4e6fa?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", organic: true, local: true },
    { id: 57, name: "Organic Rosemary", price: 2.79, category: "Herbs", farm: "Herbal Haven", rating: 4.6, image: "https://images.unsplash.com/photo-1623249635395-0e03e7449ac8?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", organic: true, local: true },
    { id: 58, name: "Organic Thyme", price: 2.69, category: "Herbs", farm: "Herbal Haven", rating: 4.5, image: "https://plus.unsplash.com/premium_photo-1726138617688-e6bfd9f0de5c?q=80&w=1473&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", organic: true, local: true },
    { id: 59, name: "Organic Mint", price: 2.49, category: "Herbs", farm: "Herbal Haven", rating: 4.8, image: "https://plus.unsplash.com/premium_photo-1725549578976-2aa34e0f3d01?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", organic: true, local: true },
    { id: 60, name: "Organic Cilantro", price: 2.29, category: "Herbs", farm: "Herbal Haven", rating: 4.4, image: "https://images.unsplash.com/photo-1660092751699-39905fc4e4c5?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", organic: true, local: true }
];



const Shop = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('Popular');
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();


  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cartItems')) || [];
    const totalItems = savedCart.reduce((total, item) => total + item.quantity, 0);
    setCartCount(totalItems);
  }, []);

  const handleBuyNow = (product) => {
    navigate('/checkout', {
      state: {
        product: {
          name: product.name,
          price: product.price,
          quantity: 1,
          image: product.image,
          farm: product.farm,
        },
      },
    });
  };

  const handleAddToCart = (product) => {
    navigate('/cart', {
      state: {
        product: {
          name: product.name,
          price: product.price,
          quantity: 1,
          image: product.image,
          farm: product.farm,
        },
      },
    });
  };

  const filteredProducts = productsData
    .filter((product) =>
      product.name.toLowerCase().includes(search.toLowerCase()) &&
      (category === 'All' || product.category === category)
    )
    .sort((a, b) => {
      switch (sort) {
        case 'Price: Low to High':
          return a.price - b.price;
        case 'Price: High to Low':
          return b.price - a.price;
        case 'Newest':
          return b.id - a.id;
        default:
          return 0;
      }
    });

  return (
    <div className="bg-gray-50">

      <nav className="bg-green-200 shadow p-4 flex justify-end items-center relative">
        <div className="relative">
          <button onClick={() => navigate('/cart')} className="text-gray-700 text-xl relative">
            <i className="fas fa-shopping-cart"></i>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </nav>


      <section className="bg-gradient-to-r from-green-600 to-green-800 text-white py-12 text-center">
        <h2 className="text-4xl font-bold mb-4">Fresh From Our Local Farms</h2>
        <p className="text-xl mb-8">100% Organic, Sustainably Grown, Delivered Fresh to Your Kitchen</p>
        <div className="max-w-2xl mx-auto relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for fresh produce..."
            className="w-full py-3 px-6 rounded-full text-gray-800 shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </section>

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap gap-2 mb-6">
          {["All", "Vegetables", "Fruits", "Dairy", "Meat", "Grains", "Herbs"].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-full ${category === cat ? 'bg-green-500 text-white' : 'bg-gray-200 hover:bg-green-500 hover:text-white'} transition`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">Showing {filteredProducts.length} products</p>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option>Popular</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Newest</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg overflow-hidden shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-2">From {product.farm}</p>
                <div className="flex items-center mb-3">
                  {[...Array(Math.floor(product.rating))].map((_, i) => (
                    <i key={i} className="fas fa-star text-yellow-400"></i>
                  ))}
                </div>
                <p className="font-bold text-green-700">${product.price.toFixed(2)}</p>
                <div className="flex justify-between mt-4 gap-2">
                  <button
                    onClick={() => handleBuyNow(product)}
                    className="bg-green-700 text-white px-3 py-1 rounded hover:bg-green-800"
                  >
                    Buy Now
                  </button>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Shop;
