package domain

import (
	"testing"
	"time"

	"github.com/fwiedmann/fdi/backend/pkg/shared/mock"

	"github.com/stretchr/testify/assert"
)

func TestNewInvoice(t *testing.T) {
	type input struct {
		invoiceData RequiredInvoiceParameters
	}

	type test struct {
		wantErr          bool
		errMessage       string
		expectedResponse Invoice
		input            input
	}

	testDateTimestamp := time.Now()
	testDateStart := testDateTimestamp
	testDateEnd := testDateTimestamp.Add(time.Minute * 10)

	tests := []test{
		{
			wantErr: false,
			expectedResponse: Invoice{
				CreatedAt:      testDateTimestamp,
				ModifiedAt:     testDateTimestamp,
				LastAccessedAt: testDateTimestamp,
				StartDate:      testDateStart,
				EndDate:        testDateEnd,
				TimeRanges: []TimeRange{
					{
						StartDate: testDateStart,
						EndDate:   testDateEnd,
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
					StartDate: testDateStart,
					EndDate:   testDateEnd,
					TimeRanges: []TimeRange{
						{
							StartDate: testDateStart,
							EndDate:   testDateEnd,
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
		{
			wantErr:          true,
			errMessage:       "Invoice error: missing input: given time ranges are empty, should be a minimum of one",
			expectedResponse: Invoice{},
			input: input{
				invoiceData: RequiredInvoiceParameters{
					StartDate:  testDateStart,
					EndDate:    testDateEnd,
					TimeRanges: []TimeRange{},
				},
			},
		},
	}

	t.Parallel()
	for _, tt := range tests {
		invoice, err := NewInvoice(mock.DateServiceMock{Time: testDateTimestamp}, tt.input.invoiceData)

		if (err != nil) != tt.wantErr {
			t.Errorf("NewInvoice returned a error: %t, but test case want error: %t", err != nil, tt.wantErr)
			return
		}
		assert.Equal(t, invoice, tt.expectedResponse)
		if (err != nil) && err.Error() != tt.errMessage {
			t.Errorf("NewInoice returned error \"%s\", but wantetd \"%s\"", err.Error(), tt.errMessage)
		}
	}
}
