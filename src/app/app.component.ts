import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import * as $ from 'jquery';
import 'list.js';

declare var List: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'ex-ng';
  @ViewChild('idField') idField: ElementRef | undefined;
  @ViewChild('nameField') nameField: ElementRef | undefined;
  @ViewChild('ageField') ageField: ElementRef | undefined;
  @ViewChild('cityField') cityField: ElementRef | undefined;

  ngOnInit(): void {
    // Potresti spostare l'inizializzazione del List.js qui se necessario
  }

  ngAfterViewInit(): void {
    this.initList();
  }

  initList(): void {
    var options = {
      valueNames: ['id', 'name', 'age', 'city']
    };

    // Init list
    var contactList = new List('contacts', options);

    var idField = $('#id-field');
    var nameField = $('#name-field');
    var ageField = $('#age-field');
    var cityField = $('#city-field');
    var addBtn = $('#add-btn');
    var editBtn = $('#edit-btn').hide();
    var removeBtns = $('.remove-item-btn');
    var editBtns = $('.edit-item-btn');

    // Sets callbacks to the buttons in the list
    refreshCallbacks();

    addBtn.click(function () {
      contactList.add({
        id: Math.floor(Math.random() * 110000),
        name: nameField.val(),
        age: ageField.val(),
        city: cityField.val()
      });
      clearFields();
      refreshCallbacks();
    });

    editBtn.click(function () {
      var item = contactList.get('id', idField.val())[0];
      item.values({
        id: idField.val(),
        name: nameField.val(),
        age: ageField.val(),
        city: cityField.val()
      });
      clearFields();
      editBtn.hide();
      addBtn.show();
    });

    function refreshCallbacks() {
      // Needed to add new buttons to jQuery-extended object
      removeBtns.toArray().forEach(function (btn: any) {
        $(btn).click(function () {
          var itemId = $(this).closest('tr').find('.id').text();
          contactList.remove('id', itemId);
        });
      });

      editBtns.toArray().forEach(function (btn: any) {
        $(btn).click(function () {
          var itemId = $(this).closest('tr').find('.id').text();
          var itemValues = contactList.get('id', itemId)[0].values();
          idField.val(itemValues.id);
          nameField.val(itemValues.name);
          ageField.val(itemValues.age);
          cityField.val(itemValues.city);

          editBtn.show();
          addBtn.hide();
        });
      });

      // Associare i pulsanti di modifica agli elementi appena aggiunti
      $('.edit-item-btn').off('click').on('click', function () {
        var itemId = $(this).closest('tr').find('.id').text();
        var itemValues = contactList.get('id', itemId)[0].values();
        idField.val(itemValues.id);
        nameField.val(itemValues.name);
        ageField.val(itemValues.age);
        cityField.val(itemValues.city);

        editBtn.show();
        addBtn.hide();
      });

      // Associare i pulsanti di rimozione agli elementi appena aggiunti
      $('.remove-item-btn').off('click').on('click', function () {
        var itemId = $(this).closest('tr').find('.id').text();
        contactList.remove('id', itemId);
      });
    }

    function clearFields() {
      nameField.val('');
      ageField.val('');
      cityField.val('');
    }
  }
}
