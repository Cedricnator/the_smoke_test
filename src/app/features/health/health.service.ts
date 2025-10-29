export class HealthService {
  public getStatus(): { status: string } {
    return { status: "OK" };
  }
}