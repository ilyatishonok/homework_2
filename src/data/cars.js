const cars = {
    brands: ['Audi', 'BMW'],
    models: {
        'Audi': ['A4', 'A5', 'A6', 'R8', 'TT', 'V8'],
        'BMW': ['F25 X3', 'X6', 'F30 3 Series', 'I12 i8']
    },
    fuelTypes: {
        'Audi': {
            'A4': ['Biofuel', 'Diesel'],
            'A5': ['Gas', 'Biofuel'],
            'A6': ['Gas', 'Diesel'],
            'R8': ['Gas', 'Diesel', 'Biofuel'],
            'TT': ['Diesel', 'Electric'],
            'V8': ['Gas', 'Diesel'],
        },
        'BMW': {
            'F25 X3': ['Diesel', 'Biofuel'],
            'X6': ['Gas', 'Diesel'],
            'F30 3 Series': ['Diesel', 'Electric'],
            'I12 i8': ['Biofuel', 'Electric'],
        }
    },
    transmissionTypes: {
        'Audi': {
            'A4': ['Automatic Transmission', 'Manual Transmission'],
            'A5': ['Automatic Transmission', 'Manual Transmission'],
            'A6': ['Automatic Transmission'],
            'R8': ['Automatic Transmission', 'Manual Transmission', 'Automated Manual Transmission'],
            'TT': ['Automatic Transmission', 'Automated Manual Transmission'],
            'V8': ['Manual Transmission', 'Automated Manual Transmission'],
        },
        'BMW': {
            'F25 X3': ['Automatic Transmission', 'Manual Transmission'],
            'X6': ['Automatic Transmission', 'Automated Manual Transmission'],
            'F30 3 Series': ['Automatic Transmission', 'Automated Manual Transmission'],
            'I12 i8': ['Manual Transmission', 'Automated Manual Transmission'],
        },
    },
}