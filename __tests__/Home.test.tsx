import OneBouteousPage from '@/components/Dashboard/';
import { dashboardTexts } from '@/helper/constants/textName';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';



describe('OneBouteousPage', () => {
    test('menu icon click works', () => {
        render(<OneBouteousPage />);

        // Check if menu icon is present
        const menuIcon = screen.getByLabelText('open drawer');
        expect(menuIcon).toBeInTheDocument();

        // Simulate clicking the menu icon
        fireEvent.click(menuIcon);

        // You can assert some expected behavior after the menu icon is clicked
        // For example, check if a navigation menu is displayed, etc.
    });

    it('should have App Dashboards text', () => {
        render(<OneBouteousPage />) //ARRANGE

        const myElem = screen.getByText('App Dashboard') //ACTION

        expect(myElem).toBeInTheDocument(); //ASSERT
    })
});