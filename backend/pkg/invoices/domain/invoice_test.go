package domain

import (
	"github.com/fwiedmann/fdi/backend/pkg/shared/mock"
	"github.com/stretchr/testify/assert"
	"testing"
	"time"
)

func TestNewInvoice(t *testing.T) {
	type input struct {
		invoiceData RequiredInvoiceParameters
	}

	type test struct {
		wantErr          bool
		expectedResponse Invoice
		input            input
	}

	testDate := time.Now()
	tests := []test{
		{
			wantErr: false,
			expectedResponse: Invoice{
				StartDate: testDate,
				EndDate:   testDate,
				TimeRanges: []TimeRange{
					{
						StartDate: testDate,
						EndDate:   testDate,
						Members: []Member{
							{
								Id:            "1",
								dirtAllowance: false,
							},
						},
					},
				},
			},
			input: input{
				invoiceData: RequiredInvoiceParameters{
					StartDate: testDate,
					EndDate:   testDate,
					TimeRanges: []TimeRange{
						{
							StartDate: testDate,
							EndDate:   testDate,
							Members: []Member{
								{
									Id:            "1",
									dirtAllowance: false,
								},
							},
						},
					},
				},
			},
		},
	}

	t.Parallel()
	for _, tt := range tests {
		invoice, err := NewInvoice(mock.DateServiceMock{Time: testDate}, tt.input.invoiceData)

		if (err != nil) != tt.wantErr {
			t.Errorf("NewInvoice returned error %s, but test case want error: %t", err, tt.wantErr)
			return
		}
		assert.Equal(t, invoice, tt.expectedResponse)
	}
}
