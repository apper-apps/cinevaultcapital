const watchlistService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "movie_id" } },
          { field: { Name: "added_date" } },
          { field: { Name: "watched" } },
          { field: { Name: "user_rating" } }
        ],
        orderBy: [
          {
            fieldName: "added_date",
            sorttype: "DESC"
          }
        ]
      };
      
      const response = await apperClient.fetchRecords('watchlist', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return (response.data || []).map(item => ({
        Id: item.Id,
        movieId: item.movie_id,
        addedDate: item.added_date,
        watched: item.watched,
        userRating: item.user_rating
      }));
    } catch (error) {
      console.error("Error fetching watchlist:", error);
      throw error;
    }
  },

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "movie_id" } },
          { field: { Name: "added_date" } },
          { field: { Name: "watched" } },
          { field: { Name: "user_rating" } }
        ]
      };
      
      const response = await apperClient.getRecordById('watchlist', parseInt(id, 10), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (!response.data) {
        throw new Error('Watchlist item not found');
      }
      
      return {
        Id: response.data.Id,
        movieId: response.data.movie_id,
        addedDate: response.data.added_date,
        watched: response.data.watched,
        userRating: response.data.user_rating
      };
    } catch (error) {
      console.error(`Error fetching watchlist item with ID ${id}:`, error);
      throw error;
    }
  },

  async create(item) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        records: [
          {
            movie_id: parseInt(item.movieId, 10),
            added_date: new Date().toISOString(),
            watched: false,
            user_rating: null
          }
        ]
      };
      
      const response = await apperClient.createRecord('watchlist', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error('Failed to create watchlist item');
        }
        
        if (successfulRecords.length > 0) {
          const createdItem = successfulRecords[0].data;
          return {
            Id: createdItem.Id,
            movieId: createdItem.movie_id,
            addedDate: createdItem.added_date,
            watched: createdItem.watched,
            userRating: createdItem.user_rating
          };
        }
      }
      
      throw new Error('Failed to create watchlist item');
    } catch (error) {
      console.error("Error creating watchlist item:", error);
      throw error;
    }
  },

  async update(id, data) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const updateData = {
        Id: parseInt(id, 10)
      };
      
      if (data.hasOwnProperty('watched')) {
        updateData.watched = data.watched;
      }
      if (data.hasOwnProperty('userRating')) {
        updateData.user_rating = data.userRating;
      }
      
      const params = {
        records: [updateData]
      };
      
      const response = await apperClient.updateRecord('watchlist', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          throw new Error('Failed to update watchlist item');
        }
        
        if (successfulUpdates.length > 0) {
          const updatedItem = successfulUpdates[0].data;
          return {
            Id: updatedItem.Id,
            movieId: updatedItem.movie_id,
            addedDate: updatedItem.added_date,
            watched: updatedItem.watched,
            userRating: updatedItem.user_rating
          };
        }
      }
      
      throw new Error('Failed to update watchlist item');
    } catch (error) {
      console.error("Error updating watchlist item:", error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        RecordIds: [parseInt(id, 10)]
      };
      
      const response = await apperClient.deleteRecord('watchlist', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          throw new Error('Failed to delete watchlist item');
        }
        
        return successfulDeletions.length > 0;
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting watchlist item:", error);
      throw error;
    }
  },

  async isInWatchlist(movieId) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "Name" } }
        ],
        where: [
          {
            FieldName: "movie_id",
            Operator: "EqualTo",
            Values: [movieId.toString()]
          }
        ]
      };
      
      const response = await apperClient.fetchRecords('watchlist', params);
      
      if (!response.success) {
        return false;
      }
      
      return (response.data || []).length > 0;
    } catch (error) {
      console.error("Error checking watchlist status:", error);
      return false;
    }
  },

  async getByMovieId(movieId) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "movie_id" } },
          { field: { Name: "added_date" } },
          { field: { Name: "watched" } },
          { field: { Name: "user_rating" } }
        ],
        where: [
          {
            FieldName: "movie_id",
            Operator: "EqualTo",
            Values: [movieId.toString()]
          }
        ]
      };
      
      const response = await apperClient.fetchRecords('watchlist', params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }
      
      if (response.data && response.data.length > 0) {
        const item = response.data[0];
        return {
          Id: item.Id,
          movieId: item.movie_id,
          addedDate: item.added_date,
          watched: item.watched,
          userRating: item.user_rating
        };
      }
      
      return null;
    } catch (error) {
      console.error("Error fetching watchlist item by movie ID:", error);
      return null;
    }
  }
};

export default watchlistService;