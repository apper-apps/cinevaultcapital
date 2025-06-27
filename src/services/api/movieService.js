const movieService = {
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
          { field: { Name: "title" } },
          { field: { Name: "year" } },
          { field: { Name: "poster" } },
          { field: { Name: "synopsis" } },
          { field: { Name: "rating" } },
          { field: { Name: "genres" } },
          { field: { Name: "cast" } },
          { field: { Name: "director" } },
          { field: { Name: "streaming_links" } }
        ],
        orderBy: [
          {
            fieldName: "rating",
            sorttype: "DESC"
          }
        ]
      };
      
      const response = await apperClient.fetchRecords('movie', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching movies:", error);
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
          { field: { Name: "title" } },
          { field: { Name: "year" } },
          { field: { Name: "poster" } },
          { field: { Name: "synopsis" } },
          { field: { Name: "rating" } },
          { field: { Name: "genres" } },
          { field: { Name: "cast" } },
          { field: { Name: "director" } },
          { field: { Name: "streaming_links" } }
        ]
      };
      
      const response = await apperClient.getRecordById('movie', parseInt(id, 10), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (!response.data) {
        throw new Error('Movie not found');
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching movie with ID ${id}:`, error);
      throw error;
    }
  },

  async getTrending() {
    try {
      const movies = await this.getAll();
      return movies
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 8);
    } catch (error) {
      console.error("Error fetching trending movies:", error);
      throw error;
    }
  },

  async getByGenre(genre) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "year" } },
          { field: { Name: "poster" } },
          { field: { Name: "synopsis" } },
          { field: { Name: "rating" } },
          { field: { Name: "genres" } },
          { field: { Name: "cast" } },
          { field: { Name: "director" } },
          { field: { Name: "streaming_links" } }
        ],
        where: [
          {
            FieldName: "genres",
            Operator: "Contains",
            Values: [genre]
          }
        ]
      };
      
      const response = await apperClient.fetchRecords('movie', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching movies by genre:", error);
      throw error;
    }
  },

  async search(query) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "year" } },
          { field: { Name: "poster" } },
          { field: { Name: "synopsis" } },
          { field: { Name: "rating" } },
          { field: { Name: "genres" } },
          { field: { Name: "cast" } },
          { field: { Name: "director" } },
          { field: { Name: "streaming_links" } }
        ],
        whereGroups: [
          {
            operator: "OR",
            subGroups: [
              {
                conditions: [
                  {
                    fieldName: "title",
                    operator: "Contains",
                    values: [query]
                  }
                ]
              },
              {
                conditions: [
                  {
                    fieldName: "director",
                    operator: "Contains",
                    values: [query]
                  }
                ]
              },
              {
                conditions: [
                  {
                    fieldName: "cast",
                    operator: "Contains",
                    values: [query]
                  }
                ]
              },
              {
                conditions: [
                  {
                    fieldName: "genres",
                    operator: "Contains",
                    values: [query]
                  }
                ]
              }
            ]
          }
        ]
      };
      
      const response = await apperClient.fetchRecords('movie', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error searching movies:", error);
      throw error;
    }
  },

  async getPopular() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "year" } },
          { field: { Name: "poster" } },
          { field: { Name: "synopsis" } },
          { field: { Name: "rating" } },
          { field: { Name: "genres" } },
          { field: { Name: "cast" } },
          { field: { Name: "director" } },
          { field: { Name: "streaming_links" } }
        ],
        where: [
          {
            FieldName: "rating",
            Operator: "GreaterThanOrEqualTo",
            Values: ["7.5"]
          }
        ],
        orderBy: [
          {
            fieldName: "rating",
            sorttype: "DESC"
          }
        ]
      };
      
      const response = await apperClient.fetchRecords('movie', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching popular movies:", error);
      throw error;
    }
  },

  async getNewReleases() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "year" } },
          { field: { Name: "poster" } },
          { field: { Name: "synopsis" } },
          { field: { Name: "rating" } },
          { field: { Name: "genres" } },
          { field: { Name: "cast" } },
          { field: { Name: "director" } },
          { field: { Name: "streaming_links" } }
        ],
        where: [
          {
            FieldName: "year",
            Operator: "GreaterThanOrEqualTo",
            Values: ["2022"]
          }
        ],
        orderBy: [
          {
            fieldName: "year",
            sorttype: "DESC"
          }
        ]
      };
      
      const response = await apperClient.fetchRecords('movie', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching new releases:", error);
      throw error;
    }
  }
};

export default movieService;