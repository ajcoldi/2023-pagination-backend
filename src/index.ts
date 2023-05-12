import express from 'express';
const cors = require('cors');

const app = express();

// Total count: The total number of items in the entire collection, not just the current page.
// Offset: The number of items to skip before beginning to return results.
// Sort field: The field used to sort the results.
// Sort order: The direction in which to sort the results (ascending or descending).
// Filter parameters: Criteria used to filter the results (e.g. date range, category, etc.).
// Search term: A keyword or phrase used to search for specific items within the collection.
// Facets: Additional metadata about the collection, such as categories or tags, that can be used to refine the results.
// Links: URLs to other pages in the pagination sequence (e.g. first, last, next, previous).
// Meta: Additional metadata about the collection or query (e.g. server response time, status codes).

app.use(cors({ origin: 'http://localhost:3001' }));


interface User {
  id: number;
  name: string;
}

interface Results {
  results: User[];
  total_items: number;
  items_per_page: number;
  current_page: number;
  total_pages: number;
  next_page_link?: string;
  previous_page_link?: string;
  first_page_link: string;
  last_page_link: string;
  sort_by: string;
  sort_order: string;
}

const users = [  { id: 1, name: "John", age: 35, email: "john@example.com", tags: ["developer", "musician"] },
  { id: 2, name: "Alice", age: 28, email: "alice@example.com", tags: ["designer", "photographer"] },
  { id: 3, name: "Bob", age: 42, email: "bob@example.com", tags: ["developer", "surfer"] },
  { id: 4, name: "Claire", age: 31, email: "claire@example.com", tags: ["teacher", "hiker"] },
  { id: 5, name: "David", age: 45, email: "david@example.com", tags: ["developer", "gamer"] },
  { id: 6, name: "Emma", age: 26, email: "emma@example.com", tags: ["designer", "painter"] },
  { id: 7, name: "Frank", age: 39, email: "frank@example.com", tags: ["musician", "gamer"] },
  { id: 8, name: "Grace", age: 33, email: "grace@example.com", tags: ["developer", "hiker"] },
  { id: 9, name: "Henry", age: 47, email: "henry@example.com", tags: ["surfer", "hiker"] },
  { id: 10, name: "Isabella", age: 29, email: "isabella@example.com", tags: ["teacher", "photographer"] },
  { id: 11, name: "James", age: 36, email: "james@example.com", tags: ["developer", "musician"] },
  { id: 12, name: "Katie", age: 27, email: "katie@example.com", tags: ["designer", "hiker"] },
  { id: 13, name: "Liam", age: 43, email: "liam@example.com", tags: ["surfer", "gamer"] },
  { id: 14, name: "Mia", age: 30, email: "mia@example.com", tags: ["teacher", "painter"] },
  { id: 15, name: "Nathan", age: 38, email: "nathan@example.com", tags: ["developer", "photographer"] },
  { id: 16, name: "Olivia", age: 27, email: "olivia@example.com", tags: ["teacher", "surfer"] },
  { id: 17, name: "Patrick", age: 34, email: "patrick@example.com", tags: ["developer", "musician"] },
  { id: 18, name: "Quinn", age: 25, email: "quinn@example.com", tags: ["designer", "photographer"] },
  { id: 19, name: "Rachel", age: 39, email: "rachel@example.com", tags: ["developer", "hiker"] },
  { id: 20, name: "Samuel", age: 42, email: "samuel@example.com", tags: ["surfer", "gamer"] },
  { id: 21, name: "Tiffany", age: 29, email: "tiffany@example.com", tags: ["teacher", "painter"] },
  { id: 22, name: "Ursula", age: 37, email: "ursula@example.com", tags: ["developer", "musician"] },
  { id: 23, name: "Victor", age: 45, email: "victor@example.com", tags: ["designer", "photographer"] },
  { id: 24, name: "William", age: 32, email: "william@example.com", tags: ["developer", "hiker"] },
  { id: 25, name: "Xavier", age: 40, email: "xavier@example.com", tags: ["surfer", "gamer"] },
  { id: 26, name: "Yara", age: 28, email: "yara@example.com", tags: ["teacher", "painter"] },
  { id: 27, name: "Zachary", age: 36, email: "zachary@example.com", tags: ["developer", "musician"] },
  { id: 28, name: "Avery", age: 23, email: "avery@example.com", tags: ["designer", "photographer"] },
  { id: 29, name: "Benjamin", age: 41, email: "benjamin@example.com", tags: ["developer", "hiker"] },
  { id: 30, name: "Cameron", age: 30, email: "cameron@example.com", tags: ["surfer", "gamer"] },
  { id: 31, name: "Danielle", age: 26, email: "danielle@example.com", tags: ["teacher", "painter"] },
  { id: 32, name: "Ethan", age: 35, email: "ethan@example.com", tags: ["developer", "musician"] },
  { id: 33, name: "Fiona", age: 24, email: "fiona@example.com", tags: ["designer", "photographer"] },
  { id: 34, name: "Gabriel", age: 43, email: "gabriel@example.com", tags: ["developer", "hiker"] },
  { id: 35, name: "Hannah", age: 31, email: "hannah@example.com", tags: ["surfer", "gamer"] }


];
app.get('/api/users', (req, res) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const sortBy = req.query.sortBy as string || 'id';
    const sortOrder = req.query.order as string || 'asc';
    const tags = req.query.tags ? (req.query.tags as string).split(',') : [];
    const tagMode = req.query.tagMode as string || 'all'; // default to "all" mode
    const search = req.query.search as string || '';

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    let filteredUsers = [...users];
  
    if (search.length > 0) {
        filteredUsers = filteredUsers.filter(user => {
          return (
            user.name.toLowerCase().includes(search.toLowerCase()) ||
            user.email.toLowerCase().includes(search.toLowerCase())
          );
        });
      }
      

    if (tags.length > 0) {
        if (tagMode === 'all') {
          filteredUsers = filteredUsers.filter(user => {
            return tags.every(tag => user.tags.includes(tag));
          });
        } else if (tagMode === 'any') {
          filteredUsers = filteredUsers.filter(user => {
            return tags.some(tag => user.tags.includes(tag));
          });
        }
      }
    const totalItems = filteredUsers.length;
    const totalPages = Math.ceil(totalItems / limit);
  
    let sortedUsers = [...filteredUsers];
  
    switch (sortBy) {
      case 'name':
        sortedUsers.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'age':
        sortedUsers.sort((a, b) => a.age - b.age);
        break;
      case 'email':
        sortedUsers.sort((a, b) => a.email.localeCompare(b.email));
        break;
      case 'tags':
        sortedUsers.sort((a, b) => a.tags.join('').localeCompare(b.tags.join('')));
        break;
      default:
        sortedUsers.sort((a, b) => a.id - b.id);
        break;
    }
  
    if (sortOrder === 'desc') {
      sortedUsers.reverse();
    }
  
    const results: Results = {
      results: sortedUsers.slice(startIndex, endIndex),
      total_items: totalItems,
      items_per_page: limit,
      current_page: page,
      total_pages: totalPages,
      first_page_link: `/api/users?page=1&limit=${limit}&sortBy=${sortBy}&order=${sortOrder}&tags=${tags.join(',')}`,
      last_page_link: `/api/users?page=${totalPages}&limit=${limit}&sortBy=${sortBy}&order=${sortOrder}&tags=${tags.join(',')}`,
      sort_by: sortBy,
      sort_order: sortOrder
    };
  
    if (page < totalPages) {
      results.next_page_link = `/api/users?page=${page + 1}&limit=${limit}&sortBy=${sortBy}&order=${sortOrder}&tags=${tags.join(',')}`;
    }
  
    if (page > 1) {
      results.previous_page_link = `/api/users?page=${page - 1}&limit=${limit}&sortBy=${sortBy}&order=${sortOrder}&tags=${tags.join(',')}`;
    }
  
    res.json(results);
  });
  
app.get('/api/users/tags', (req, res) => {
  try {
    console.log(users)
    const uniqueTags = new Set();
    users.forEach(user => {
      user.tags.forEach(tag => {
        uniqueTags.add(tag);
      });
    });
    
    const tagsArray = Array.from(uniqueTags);
    console.log(tagsArray)
    res.json(tagsArray)
      } catch (error) {
    res.send(error)
  }
})

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
