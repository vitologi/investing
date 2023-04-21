export const assetTypesCollection = () => ({
  async find(){
    return 'find';
  },
  async findOne(){
    return 'findOne';
  },
  async deleteOne(){
    return 'deleteOne';
  },
  async insertOne(){
    return 'insertOne';
  },
  async updateOne(){
    return 'updateOne';
  },
});
