import { SelectOptionsInterface } from "../interface/select-options.interface";

export const IDNUMBER_NATURE: SelectOptionsInterface[] = [
  { value: 'cni', text: 'Carte nationale d\'identité' },
  { value: 'passeport', text: 'Passport biométrique' },
  { value: 'cs', text: 'Carte de séjour' },
  { value: 'pc', text: 'Permis de conduire' },
  { value: 'ai', text: 'Attestation d\'identité' }
];
