export const fetchPostById = async (postId: number) => {
    const response = await fetch(`https://criticconnect-386d21b2b7d1.herokuapp.com/api/posts/${postId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  
    if (!response.ok) {
      throw new Error(`Failed to fetch post: ${response.statusText}`);
    }
  
    return response.json();
  };
  
  export const updatePost = async (postId: number, updatedPost: object) => {
    const response = await fetch(`https://criticconnect-386d21b2b7d1.herokuapp.com/api/posts/${postId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedPost),
    });
  
    if (!response.ok) {
      throw new Error(`Failed to update post: ${response.statusText}`);
    }
  
    return response.json();
  };