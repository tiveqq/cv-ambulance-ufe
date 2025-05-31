import { Component, Host, h, State, Prop, Event, EventEmitter, Watch } from '@stencil/core';
import { Route, Routes } from '../../utils/router';
import { Configuration, Patient, PatientInput, PatientsApi } from '../../api/patients-api';

@Component({
  tag: 'cv1karunnyi-ambulance-ufe-track',
  styleUrl: 'cv1karunnyi-ambulance-ufe-track.css',
  shadow: true,
})
export class Cv1karunnyiAmbulanceUfeTrack {
  // Props for routing
  @Prop() view: 'list' | 'detail' | 'create' = 'list';
  @Prop() patientId?: string;
  @Prop() apiBase: string = 'http://localhost:5000/api';

  // Event emitter for navigation
  @Event() navigate: EventEmitter<Route>;

  // API client
  private patientsApi: PatientsApi;
  @State() errorMessage: string;

  // Mock data for demonstration
  @State() patients: {
    id: string;
    name: string;
    condition: string;
    diagnosisDate?: string;
    treatmentStartDate?: string;
    expectedCompletionDate?: string;
    status: string;
    doctorId: string
  }[] = [
    {
      id: '1',
      name: 'John Doe',
      condition: 'Flu',
      diagnosisDate: '2023-01-15',
      treatmentStartDate: '2023-01-16',
      expectedCompletionDate: '2023-01-30',
      status: 'in-treatment',
      doctorId: 'doctor1'
    },
    {
      id: '2',
      name: 'Jane Smith',
      condition: 'Broken arm',
      diagnosisDate: '2023-02-10',
      treatmentStartDate: '2023-02-11',
      expectedCompletionDate: '2023-03-25',
      status: 'in-treatment',
      doctorId: 'doctor1'
    },
    {
      id: '3',
      name: 'Bob Johnson',
      condition: 'Headache',
      status: 'new',
      doctorId: 'doctor1'
    }
  ];

  @State() selectedTabIndex: number = 0;
  @State() selectedPatientId: string | null = null;
  @State() isCreatingPatient: boolean = false;
  @State() newPatient: Partial<Patient> = {
    name: '',
    condition: '',
    status: 'new',
    doctorId: 'doctor1'
  };

  // Mock doctor ID (in a real app, this would come from authentication)
  private doctorId: string = 'doctor1';

  // Watch for changes to props
  @Watch('view')
  viewChanged(newView: string) {
    if (newView === 'create') {
      this.isCreatingPatient = true;
      this.selectedPatientId = null;
      this.newPatient = {
        name: '',
        condition: '',
        status: 'new',
        doctorId: this.doctorId
      };
    } else if (newView === 'detail' && this.patientId) {
      this.selectedPatientId = this.patientId;
      this.isCreatingPatient = false;
    } else {
      // Default to list view
      this.isCreatingPatient = false;
    }
  }

  @Watch('patientId')
  patientIdChanged(newPatientId: string) {
    if (newPatientId && this.view === 'detail') {
      this.selectedPatientId = newPatientId;
      this.isCreatingPatient = false;
    }
  }

  componentWillLoad() {
    // Initialize API client
    const configuration = new Configuration({
      basePath: this.apiBase,
    });
    this.patientsApi = new PatientsApi(configuration);

    // Initialize based on props
    this.viewChanged(this.view);
    if (this.patientId) {
      this.patientIdChanged(this.patientId);
    }

    // Fetch patients from API
    this.fetchPatients();
  }

  private async fetchPatients() {
    try {
      const response = await this.patientsApi.getPatientsRaw();
      if (response.raw.status < 299) {
        this.patients = await response.value();
      } else {
        this.errorMessage = `Cannot retrieve list of patients: ${response.raw.statusText}`;
      }
    } catch (err: any) {
      this.errorMessage = `Cannot retrieve list of patients: ${err.message || "unknown"}`;
    }
  }

  private handleTabChange(event: CustomEvent) {
    this.selectedTabIndex = event.detail.index;
    this.selectedPatientId = null;
    this.isCreatingPatient = false;
  }

  private handlePatientSelect(patientId: string) {
    // Use Navigation API to navigate to patient detail
    this.navigate.emit(Routes.patientDetail(patientId));
  }

  private handleCreatePatient() {
    // Use Navigation API to navigate to create patient
    console.log('handleCreatePatient called, emitting navigation event to:', Routes.PATIENT_CREATE);
    this.navigate.emit({ path: Routes.PATIENT_CREATE });
  }

  private async handleSaveNewPatient() {
    try {
      const patientInput: PatientInput = {
        name: this.newPatient.name,
        condition: this.newPatient.condition,
        status: 'new'
      };

      const response = await this.patientsApi.createPatientRaw({ patient: patientInput });

      if (response.raw.status < 299) {
        const newPatient = await response.value();

        // Add the new patient to the local list
        this.patients = [...this.patients, newPatient];

        // Navigate to the newly created patient's detail page
        this.navigate.emit(Routes.patientDetail(newPatient.id));
      } else {
        this.errorMessage = `Cannot create patient: ${response.raw.statusText}`;
      }
    } catch (err: any) {
      this.errorMessage = `Cannot create patient: ${err.message || "unknown"}`;
    }
  }

  private async handleUpdatePatient(updatedPatient: {
    id: string;
    name: string;
    condition: any;
    diagnosisDate?: string;
    treatmentStartDate?: string;
    expectedCompletionDate?: string;
    status: string;
    doctorId: string
  }) {
    try {
      const patientInput: PatientInput = {
        name: updatedPatient.name,
        condition: updatedPatient.condition,
        diagnosisDate: updatedPatient.diagnosisDate,
        treatmentStartDate: updatedPatient.treatmentStartDate,
        expectedCompletionDate: updatedPatient.expectedCompletionDate,
        status: updatedPatient.status
      };

      const response = await this.patientsApi.updatePatientRaw({
        patientId: updatedPatient.id,
        patient: patientInput
      });

      if (response.raw.status < 299) {
        const updatedPatientFromApi = await response.value();

        // Update the patient in the local list
        this.patients = this.patients.map(p =>
          p.id === updatedPatientFromApi.id ? updatedPatientFromApi : p
        );
      } else {
        this.errorMessage = `Cannot update patient: ${response.raw.statusText}`;
      }
    } catch (err: any) {
      this.errorMessage = `Cannot update patient: ${err.message || "unknown"}`;
    }
  }

  private async handleArchivePatient(patientId: string) {
    try {
      const response = await this.patientsApi.archivePatientRaw({ patientId });

      if (response.raw.status < 299) {
        // Remove the patient from the local list
        this.patients = this.patients.filter(p => p.id !== patientId);

        // Navigate back to the patient list
        this.navigate.emit({ path: Routes.PATIENT_LIST });
      } else {
        this.errorMessage = `Cannot archive patient: ${response.raw.statusText}`;
      }
    } catch (err: any) {
      this.errorMessage = `Cannot archive patient: ${err.message || "unknown"}`;
    }
  }

  private renderPatientList() {
    const filteredPatients = this.patients.filter(p => {
      if (this.selectedTabIndex === 0) return true; // All patients
      if (this.selectedTabIndex === 1) return p.status === 'new'; // New patients
      if (this.selectedTabIndex === 2) return p.status === 'diagnosed' || p.status === 'in-treatment'; // In treatment
      if (this.selectedTabIndex === 3) return p.status === 'completed'; // Completed
      return false;
    });

    return (
      <div class="patient-list">
        <md-filled-button onClick={() => this.handleCreatePatient()}>
          Create New Patient Case
        </md-filled-button>

        <md-list>
          {filteredPatients.map(patient => (
            <md-list-item
              onClick={() => this.handlePatientSelect(patient.id)}
              selected={this.selectedPatientId === patient.id}
            >
              <div slot="headline">{patient.name}</div>
              <div slot="supporting-text">Condition: {patient.condition}</div>
              <div slot="supporting-text">
                Status: <span class={`status-${patient.status}`}>{patient.status}</span>
              </div>
            </md-list-item>
          ))}
        </md-list>
      </div>
    );
  }

  private renderPatientDetail() {
    if (!this.selectedPatientId) return null;

    const patient = this.patients.find(p => p.id === this.selectedPatientId);
    if (!patient) return null;

    return (
      <div class="patient-detail">
        <h2>Patient Details</h2>

        <md-outlined-text-field
          label="Name"
          value={patient.name}
          readonly
        ></md-outlined-text-field>

        <md-outlined-text-field
          label="Condition"
          value={patient.condition}
          onInput={(e: any) => {
            const updatedPatient = { ...patient, condition: e.target.value };
            this.handleUpdatePatient(updatedPatient);
          }}
        ></md-outlined-text-field>

        <md-outlined-text-field
          label="Diagnosis Date"
          type="date"
          value={patient.diagnosisDate || ''}
          onInput={(e: any) => {
            const updatedPatient = {
              ...patient,
              diagnosisDate: e.target.value,
              status: patient.status === 'new' ? 'diagnosed' : patient.status
            };
            this.handleUpdatePatient(updatedPatient);
          }}
        ></md-outlined-text-field>

        <md-outlined-text-field
          label="Treatment Start Date"
          type="date"
          value={patient.treatmentStartDate || ''}
          onInput={(e: any) => {
            const updatedPatient = {
              ...patient,
              treatmentStartDate: e.target.value,
              status: 'in-treatment'
            };
            this.handleUpdatePatient(updatedPatient);
          }}
        ></md-outlined-text-field>

        <md-outlined-text-field
          label="Expected Completion Date"
          type="date"
          value={patient.expectedCompletionDate || ''}
          onInput={(e: any) => {
            const updatedPatient = {
              ...patient,
              expectedCompletionDate: e.target.value
            };
            this.handleUpdatePatient(updatedPatient);
          }}
        ></md-outlined-text-field>

        <div class="button-row">
          <md-filled-button
            onClick={() => {
              const updatedPatient = { ...patient, status: 'completed' };
              this.handleUpdatePatient(updatedPatient);
            }}
            disabled={patient.status === 'completed'}
          >
            Mark as Completed
          </md-filled-button>

          <md-outlined-button
            onClick={() => this.handleArchivePatient(patient.id)}
          >
            Archive Patient
          </md-outlined-button>
        </div>
      </div>
    );
  }

  private renderCreatePatientForm() {
    if (!this.isCreatingPatient) return null;

    return (
      <div class="create-patient">
        <h2>Create New Patient Case</h2>

        <md-outlined-text-field
          label="Name"
          required
          value={this.newPatient.name}
          onInput={(e: any) => {
            this.newPatient = { ...this.newPatient, name: e.target.value };
          }}
        ></md-outlined-text-field>

        <md-outlined-text-field
          label="Condition"
          required
          value={this.newPatient.condition}
          onInput={(e: any) => {
            this.newPatient = { ...this.newPatient, condition: e.target.value };
          }}
        ></md-outlined-text-field>

        <div class="button-row">
          <md-filled-button
            onClick={() => this.handleSaveNewPatient()}
            disabled={!this.newPatient.name || !this.newPatient.condition}
          >
            Save
          </md-filled-button>

          <md-outlined-button
            onClick={() => this.isCreatingPatient = false}
          >
            Cancel
          </md-outlined-button>
        </div>
      </div>
    );
  }

  render() {
    return (
      <Host>
        <div class="container">
          <h1>Patient Treatment Tracking</h1>

          {this.errorMessage && (
            <div class="error-message">
              <p>{this.errorMessage}</p>
              <md-text-button onClick={() => this.errorMessage = null}>Dismiss</md-text-button>
            </div>
          )}

          <md-tabs
            onMdTabChange={(e) => this.handleTabChange(e)}
          >
            <md-primary-tab>All Patients</md-primary-tab>
            <md-primary-tab>New</md-primary-tab>
            <md-primary-tab>In Treatment</md-primary-tab>
            <md-primary-tab>Completed</md-primary-tab>
          </md-tabs>

          <div class="content">
            <div class="left-panel">
              {this.renderPatientList()}
            </div>

            <div class="right-panel">
              {this.isCreatingPatient
                ? this.renderCreatePatientForm()
                : this.renderPatientDetail()}
            </div>
          </div>
        </div>
      </Host>
    );
  }
}
