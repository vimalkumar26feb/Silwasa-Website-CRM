import { dashboardRepository } from '../repositories/dashboard.repository.js';

export class DashboardService {
  async getDashboardSummary() {
    return dashboardRepository.getMetrics();
  }
}

export const dashboardService = new DashboardService();
