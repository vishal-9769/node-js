        function getData(td){
            var selectedrow = td.parentElement.parentElement;
            document.getElementById("fn").value =selectedrow.cells[0].innerHTML;
            document.getElementById("ln").value =selectedrow.cells[1].innerHTML; 
            document.getElementById('btnedit').value='Update';
        }
