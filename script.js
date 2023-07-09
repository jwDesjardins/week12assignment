$(document).ready(function() {
    // API endpoint URL from MockAPI
    var apiEndpoint = 'https://64a9a1c98b9afaf4844aed98.mockapi.io/api/v1/reservations';
  
    // Retrieve existing reservations from the API
    function fetchReservations() {
      $.ajax({
        url: apiEndpoint,
        method: 'GET',
        success: function(data) {
          displayReservations(data);
        },
        error: function(jqXHR, textStatus, errorThrown) {
          console.log('Error:', textStatus, errorThrown);
        }
      });
    }
  
    // Display reservations in the table
    function displayReservations(reservations) {
      var tableBody = $('#reservationTable tbody');
      tableBody.empty();
  
      reservations.forEach(function(reservation) {
        var row = '<tr>' +
          '<td>' + reservation.guestName + '</td>' +
          '<td>' + reservation.roomType + '</td>' +
          '<td>' + reservation.checkIn + '</td>' +
          '<td>' + reservation.checkOut + '</td>' +
          '<td>' +
          '<button class="btn btn-sm btn-info edit-btn" data-id="' + reservation.id + '">Edit</button> ' +
          '<button class="btn btn-sm btn-danger delete-btn" data-id="' + reservation.id + '">Delete</button>' +
          '</td>' +
          '</tr>';
  
        tableBody.append(row);
      });
    }
  
    // Create a new reservation
    $('#reservationForm').submit(function(event) {
      event.preventDefault();
  
      var guestName = $('#guestName').val();
      var roomType = $('#roomType').val();
      var checkIn = $('#checkIn').val();
      var checkOut = $('#checkOut').val();
  
      var reservation = {
        guestName: guestName,
        roomType: roomType,
        checkIn: checkIn,
        checkOut: checkOut
      };
  
      $.ajax({
        url: apiEndpoint,
        method: 'POST',
        data: reservation,
        success: function(data) {
          fetchReservations();
          $('#reservationForm')[0].reset();
        },
        error: function(jqXHR, textStatus, errorThrown) {
          console.log('Error:', textStatus, errorThrown);
        }
      });
    });
  
    // Edit a reservation
    $('#reservationTable').on('click', '.edit-btn', function() {
      var reservationId = $(this).data('id');
  
      // Retrieve the reservation data for editing
      $.ajax({
        url: apiEndpoint + '/' + reservationId,
        method: 'GET',
        success: function(data) {
          $('#guestName').val(data.guestName);
          $('#roomType').val(data.roomType);
          $('#checkIn').val(data.checkIn);
          $('#checkOut').val(data.checkOut);
  
          // Update the form submit event to handle the update operation
          $('#reservationForm').off('submit').on('submit', function(event) {
            event.preventDefault();
  
            var updatedReservation = {
              guestName: $('#guestName').val(),
              roomType: $('#roomType').val(),
              checkIn: $('#checkIn').val(),
              checkOut: $('#checkOut').val()
            };
  
            // Perform the update operation
            $.ajax({
              url: apiEndpoint + '/' + reservationId,
              method: 'PUT',
              data: updatedReservation,
              success: function(data) {
                fetchReservations();
                $('#reservationForm')[0].reset();
              },
              error: function(jqXHR, textStatus, errorThrown) {
                console.log('Error:', textStatus, errorThrown);
              }
            });
          });
        },
        error: function(jqXHR, textStatus, errorThrown) {
          console.log('Error:', textStatus, errorThrown);
        }
      });
    });
  
    // Delete a reservation
    $('#reservationTable').on('click', '.delete-btn', function() {
      var reservationId = $(this).data('id');
  
      // Perform the delete operation
      $.ajax({
        url: apiEndpoint + '/' + reservationId,
        method: 'DELETE',
        success: function(data) {
          fetchReservations();
        },
        error: function(jqXHR, textStatus, errorThrown) {
          console.log('Error:', textStatus, errorThrown);
        }
      });
    });
  
    // Fetch and display existing reservations on page load
    fetchReservations();
  });
  