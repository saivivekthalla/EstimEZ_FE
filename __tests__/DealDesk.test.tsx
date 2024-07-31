import { render, screen, fireEvent, act } from '@testing-library/react';
import RightRoleTable from '@/components/DealDesk/';
import fetchMock from 'jest-fetch-mock';

describe('Table Component', () => {
  it('renders table headers correctly', () => {
    const { getByText } = render(<RightRoleTable />);

    // Replace the text below with the actual header text you expect
    expect(getByText('Roles')).toBeInTheDocument();
    expect(getByText('Region')).toBeInTheDocument();
    expect(getByText('SPR')).toBeInTheDocument();
    expect(getByText('Cost/Hr')).toBeInTheDocument();
    expect(getByText('Phase')).toBeInTheDocument();
    expect(getByText('Standard Cost')).toBeInTheDocument();
    expect(getByText('Calculated Cost')).toBeInTheDocument();
    // Add more expectations for other headers as needed
  });

  // Add more test cases for different aspects of table rendering
});

describe('DataTable Component', () => {
  beforeAll(() => {
    fetchMock.enableMocks();
  });

  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it('displays data in the table', async () => {
    const mockData = [
      {
        roles: "Techincal Manager",
        phase: "Discover",
        region: "NA",
        spr: "80%",
        cost: "4",
        standardAmount: "$4500",
        calculatedAmount: "$7500",
        standardProgress: 45,
        calculatedProgress: 80
      },
      {
        roles: "Techincal Lead",
        phase: "Conceive",
        region: "NA",
        spr: "100%",
        cost: "4",
        standardAmount: "$4500",
        calculatedAmount: "$7500",
        standardProgress: 45,
        calculatedProgress: 80
      },
    ];

    fetchMock.mockResponseOnce(JSON.stringify(mockData));

    let getByText: any;

    await act(async () => {
      const renderResult = render(<RightRoleTable />);
      getByText = renderResult.getByText;
    });

    // Verify that the table headers are rendered
    expect(getByText('Roles')).toBeInTheDocument();
    expect(getByText('Phase')).toBeInTheDocument();
    expect(getByText('Region')).toBeInTheDocument();
    expect(getByText('SPR')).toBeInTheDocument();
    expect(getByText('Cost/Hr')).toBeInTheDocument();


    // Verify that the data is displayed in the table
    expect(getByText('Techincal Manager')).toBeInTheDocument();
    expect(getByText('Discover')).toBeInTheDocument();
    expect(getByText('NA')).toBeInTheDocument();
    expect(getByText('80%')).toBeInTheDocument();
    expect(getByText('4')).toBeInTheDocument();
  });
});

