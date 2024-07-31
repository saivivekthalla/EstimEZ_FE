import { render, screen } from '@testing-library/react';
import RoleRedundancy from '@/components/DealDesk/RoleRedundancy';

describe('RoleRedundancy Component', () => {
    it('renders table headers correctly', () => {
        render(<RoleRedundancy />);

        expect(screen.getByText('Roles')).toBeInTheDocument();
        expect(screen.getByText('Phase')).toBeInTheDocument();
        expect(screen.getByText('Region')).toBeInTheDocument();
        expect(screen.getByText('Number of Occurrences')).toBeInTheDocument();
        expect(screen.getByText('Role Frequency')).toBeInTheDocument();
    });

    it('displays data in the table', () => {
        render(<RoleRedundancy />);

        const textsToCheck = [
            { Roles: 'Technical Manager', Phase: 'Phase A', Region: 'North', occurrences: 2, frequency: 25 },
            { Roles: 'Manager', Phase: 'Phase B', Region: 'South', occurrences: 3, frequency: 100 },
            { Roles: 'Engineer', Phase: 'Phase C', Region: 'West', occurrences: 1, frequency: 10 },
            { Roles: 'Analyst', Phase: 'Phase A', Region: 'East', occurrences: 4, frequency: 75 },
            { Roles: 'Supervisor', Phase: 'Phase B', Region: 'North', occurrences: 2, frequency: 30 },
            { Roles: 'Developer', Phase: 'Phase C', Region: 'South', occurrences: 2, frequency: 45 },
            { Roles: 'Coordinator', Phase: 'Phase A', Region: 'West', occurrences: 1, frequency: 15 },
            { Roles: 'Architect', Phase: 'Phase B', Region: 'East', occurrences: 3, frequency: 60 },];

        textsToCheck.forEach(text => {
            expect(screen.getAllByText(text.Roles).length).toBeGreaterThan(0);
            expect(screen.getAllByText(text.Phase).length).toBeGreaterThan(0);
            expect(screen.getAllByText(text.Region).length).toBeGreaterThan(0);
            expect(screen.getAllByText(text.occurrences).length).toBeGreaterThan(0);
        });



    });

});
