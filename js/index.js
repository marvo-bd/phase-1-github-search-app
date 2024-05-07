document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('github-form');
    const searchInput = document.getElementById('search');
    const userList = document.getElementById('user-list');
    const reposList = document.getElementById('repos-list');
  
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const searchTerm = searchInput.value.trim();
      if (!searchTerm) return;
  
      try {
        const usersResponse = await fetch(`https://api.github.com/search/users?q=${searchTerm}`, {
          headers: {
            'Accept': 'application/vnd.github.v3+json'
          }
        });
        if (!usersResponse.ok) {
          throw new Error('Failed to fetch users');
        }
        const usersData = await usersResponse.json();
  
        // Clear previous search results
        userList.innerHTML = '';
  
        usersData.items.forEach(user => {
          const li = document.createElement('li');
          const avatar = document.createElement('img');
          avatar.src = user.avatar_url;
          avatar.alt = `${user.login} avatar`;
          const username = document.createElement('span');
          username.textContent = user.login;
          const profileLink = document.createElement('a');
          profileLink.href = user.html_url;
          profileLink.textContent = 'Profile';
          profileLink.target = '_blank';
  
          li.appendChild(avatar);
          li.appendChild(username);
          li.appendChild(profileLink);
          userList.appendChild(li);
  
          // Add event listener for clicking on a user
          li.addEventListener('click', async () => {
            try {
              const reposResponse = await fetch(`https://api.github.com/users/${user.login}/repos`, {
                headers: {
                  'Accept': 'application/vnd.github.v3+json'
                }
              });
              if (!reposResponse.ok) {
                throw new Error('Failed to fetch user repositories');
              }
              const reposData = await reposResponse.json();
  
              // Clear previous repositories
              reposList.innerHTML = '';
  
              reposData.forEach(repo => {
                const repoLi = document.createElement('li');
                const repoName = document.createElement('span');
                repoName.textContent = repo.name;
                repoLi.appendChild(repoName);
                reposList.appendChild(repoLi);
              });
            } catch (error) {
              console.error('Error fetching user repositories:', error.message);
            }
          });
        });
  
      } catch (error) {
        console.error('Error fetching users:', error.message);
      }
    });
  });
  