export class ApiKeyService {
  private static instance: ApiKeyService;

  public static getInstance(): ApiKeyService {
    if (!ApiKeyService.instance) {
      ApiKeyService.instance = new ApiKeyService();
    }
    return ApiKeyService.instance;
  }

  // TODO: Create key

  // TODO: Delete key

  // TODO: Get key by 
}
