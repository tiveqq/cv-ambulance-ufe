/**
 * Patient Treatment API client
 */

// Configuration for the API client
export class Configuration {
  basePath: string;

  constructor(config: { basePath: string }) {
    this.basePath = config.basePath;
  }
}

// Patient interface matching the OpenAPI schema
export interface Patient {
  id: string;
  name: string;
  condition: string;
  diagnosisDate?: string;
  treatmentStartDate?: string;
  expectedCompletionDate?: string;
  status: string;
  doctorId: string;
}

// Patient input interface for create/update operations
export interface PatientInput {
  name: string;
  condition: string;
  diagnosisDate?: string;
  treatmentStartDate?: string;
  expectedCompletionDate?: string;
  status?: string;
}

// API response with raw response and value
export interface ApiResponse<T> {
  raw: Response;
  value: () => Promise<T>;
}

// Patients API client
export class PatientsApi {
  private configuration: Configuration;

  constructor(configuration: Configuration) {
    this.configuration = configuration;
  }

  /**
   * Get list of patients
   */
  async getPatientsRaw(): Promise<ApiResponse<Patient[]>> {
    const response = await fetch(`${this.configuration.basePath}/patients`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    return {
      raw: response,
      value: async () => {
        if (response.status < 400) {
          return response.json();
        }
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      },
    };
  }

  /**
   * Get a specific patient by ID
   */
  async getPatientRaw(params: { patientId: string }): Promise<ApiResponse<Patient>> {
    const { patientId } = params;
    const response = await fetch(`${this.configuration.basePath}/patients/${patientId}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    return {
      raw: response,
      value: async () => {
        if (response.status < 400) {
          return response.json();
        }
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      },
    };
  }

  /**
   * Create a new patient
   */
  async createPatientRaw(params: { patient: PatientInput }): Promise<ApiResponse<Patient>> {
    const { patient } = params;
    const response = await fetch(`${this.configuration.basePath}/patients/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(patient),
    });

    return {
      raw: response,
      value: async () => {
        if (response.status < 400) {
          return response.json();
        }
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      },
    };
  }

  /**
   * Update an existing patient
   */
  async updatePatientRaw(params: { patientId: string; patient: PatientInput }): Promise<ApiResponse<Patient>> {
    const { patientId, patient } = params;
    const response = await fetch(`${this.configuration.basePath}/patients/${patientId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(patient),
    });

    return {
      raw: response,
      value: async () => {
        if (response.status < 400) {
          return response.json();
        }
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      },
    };
  }

  /**
   * Archive (delete) a patient
   */
  async archivePatientRaw(params: { patientId: string }): Promise<ApiResponse<void>> {
    const { patientId } = params;
    const response = await fetch(`${this.configuration.basePath}/patients/${patientId}`, {
      method: 'DELETE',
    });

    return {
      raw: response,
      value: async () => {
        if (response.status >= 400) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
      },
    };
  }
}
