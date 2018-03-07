(function() {
  $(".scramble").each(function() {
    var $letters, $spacers, $this, insertSpacers, isCorrect, parseWord, randomize, scrambledWord, spacerHTML, unscrambledWord;
    $this = $(this);
    $letters = $this.find(".scrambled-letter").not(".drag-clone");
    $spacers = $this.find(".spacer");
    unscrambledWord = $this.data("unscrambled");
    scrambledWord = $this.data("scrambled");
    spacerHTML = "<span class=\"spacer\"></span>";
    
    // If no scrambled version of the word was provided, create one by randomizing the letters    
    if ($letters.length === 0 && scrambledWord === undefined && unscrambledWord !== undefined) {
      
      // This do-while loop will prevent the scrambled word from being the same as the unscrambled one due to terribly bad luck
      randomize = function() {
        return 0.5 - Math.random();
      };
      while (true) {
        scrambledWord = unscrambledWord.split("").sort(randomize).join("");
        if (scrambledWord !== unscrambledWord) {
          break;
        }
      }
    }
    
    // Create the letters based on the data attribute
    if (scrambledWord !== undefined && $letters.length === 0) {
      $.map(scrambledWord.split(""), function(letter) {
        return $this.append("<span class=\"scrambled-letter\">" + letter + "</span>");
      });
      $letters = $this.find(".scrambled-letter").not(".drag-clone");
    }
    
    // Function to surround all letters in spacers
    insertSpacers = function() {
      $this.find(".spacer").remove();
      $letters.before(spacerHTML).last().after(spacerHTML);
      $spacers = $this.find(".spacer");
    };
    insertSpacers();
    
    // Function to return whatever the currently arranged word is    
    parseWord = function() {
      var word;
      word = "";
      $letters.each(function() {
        return word += $(this).text().replace(/[^a-zA-Z]/g, "");
      });
      return word.toLowerCase();
    };
    
    // Function to return whether the currently arranged letter sequence is the correct/unscrambled one  
    isCorrect = function() {
      return parseWord() === unscrambledWord.toLowerCase();
    };
    // What happens when you mousedown/clickenhold on a letter
    return $letters.on("mousedown", function(e) {
      var $letterClone, $thisLetter, dropIntoSpacer, moveLetterWithMouse, snapLetterToPlace, thisLetterHeight, thisLetterWidth;
      e.stopPropagation();
      $thisLetter = $(this);
      thisLetterWidth = $thisLetter.outerWidth();
      thisLetterHeight = $thisLetter.outerHeight();
      $this.addClass("dragging");
      
      // Establish a clone of the currently selected letter and add it to the DOM
      $letterClone = $thisLetter.clone(false);
      $letterClone.insertBefore($thisLetter);
      
      // If this is a "middle" letter (letters on both sides), one of the spacers needs to be specified as extra
      if ($thisLetter.prevAll(".scrambled-letter").length > 0 && $thisLetter.nextAll(".scrambled-letter").length > 0) {
        $thisLetter.nextAll(".spacer").first().addClass("extra");
      }
      
      // Hide the letter you clicked, because we're going to put the clone of it under the cursor as it moves
      $thisLetter.addClass("invisible");
      $letterClone.addClass("drag-clone");
      
      // Function to position the clone w/ the mouse
      moveLetterWithMouse = function(e) {
        return $letterClone.css({
          top: e.clientY - (thisLetterHeight * 0.5),
          left: e.clientX - (thisLetterWidth * 0.5)
        });
      };
      // Run the function once to place the letter clone wherever your cursor is when you clicked    
      moveLetterWithMouse(e);
      
      // Function to snap letter to place when letting go
      snapLetterToPlace = function() {
        var realLetterOffset;
        // Unhide the original letter (it should still be .invisible however)
        $thisLetter.show();
        
        // Add the .snap-to-place class to the clone (which will enable CSS transitions) and then change its position to line up w/ the real letter
        realLetterOffset = $thisLetter.offset();
        $letterClone.addClass("snap-to-place").css({
          top: realLetterOffset.top,
          left: realLetterOffset.left
        });
        // Kill the clone, show the real one after the animation has enough time to finish
        return setTimeout((function() {
          $letterClone.remove();
          return $thisLetter.removeClass("invisible");
        }), 500);
      };
      // Function to drop tile into spacer
      dropIntoSpacer = ($thisSpacer) => {
        
        // Move original letter <span> to right before the spacer being hovered over
        $thisLetter.show().addClass("invisible").insertBefore($thisSpacer);
        
        // Re-establish the $letters object to use the new natural DOM order
        $letters = $this.find(".scrambled-letter").not(".drag-clone");
        
        // Delete and re-establish the spacers
        insertSpacers();
        snapLetterToPlace();
        if (isCorrect()) {
          
          // See if you got the word correct
          return $this.trigger("unscrambled");
        }
      };
      // When you're dragging a tile, if you approach the edge of a letter tile, assume you're aiming for that side of it 
      $letters.not('.drag-clone').not('.invisible').mousemove(function(e) {
        var $thisMouseMoveLetter, halfPoint, leftOffset, letterOffset, letterWidth, nextLetters, prevLetters;
        $thisMouseMoveLetter = $(this);
        letterOffset = $thisMouseMoveLetter.offset();
        leftOffset = e.offsetX || e.clientX - letterOffset.left;
        letterWidth = $thisMouseMoveLetter.outerWidth();
        halfPoint = letterWidth / 2;
        prevLetters = $thisLetter.prevAll('.scrambled-letter').not('.drag-clone').not('.invisible').length;
        nextLetters = $thisLetter.nextAll('.scrambled-letter').not('.drag-clone').not('.invisible').length;
        $spacers.filter('.hover').removeClass("hover");
        if (prevLetters > 0 && leftOffset > 0 && leftOffset < halfPoint) {
          return $thisMouseMoveLetter.prevAll('.spacer').not('.extra').first().addClass("hover");
        } else if (nextLetters > 0 && leftOffset < letterWidth && leftOffset > halfPoint) {
          return $thisMouseMoveLetter.nextAll('.spacer').not('.extra').first().addClass("hover");
        }
      }).mouseup(function() {
        var $thisSpacer;
        // If you mouseup in such a circumstance, drop the tile
        $thisSpacer = $spacers.filter('.hover').first();
        if ($thisSpacer.length > 0) {
          return dropIntoSpacer($thisSpacer);
        }
      }).mouseleave(function() {
        return $spacers.filter('.hover').removeClass("hover");
      });
      $spacers.not('.extra').hover(function() {
        
        // When you hover over a spacer:
        $(this).addClass("hover");
        
        // Hide the real letter (which was previously only .invisible) once you've hovered over a spacer
        // so that its empty placeholder will disappear and (seemingly) reappear wherever you hover
        return $thisLetter.hide();
      }, function() {
        // When you exit hovering a spacer:
        return $(this).removeClass("hover");
      }).mouseup(function() {
        var $thisSpacer;
        
        // Mouseup function on spacer, triggers when you "let go" of the letter you're dragging
        $thisSpacer = $(this);
        dropIntoSpacer($thisSpacer);
      });
      // Also attach the mouse drag events to the whole body, so you can drag the letter anywhere and still see it  
      $("body").mousemove(moveLetterWithMouse).on("mouseup", function() {
        if ($this.hasClass("dragging") || $(".drag-clone").length > 0) {
          $("body").unbind("mousemove", moveLetterWithMouse);
          $spacers.unbind("mousemove mouseover mouseout mouseenter mouseleave mouseup");
          $letters.unbind("mousemove mouseleave");
          snapLetterToPlace();
          return $this.removeClass("dragging");
        }
      });
      return $this.on("unscrambled", function() {
        return $this.addClass("solved");
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiPGFub255bW91cz4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFBQSxDQUFBLENBQUUsV0FBRixDQUFjLENBQUMsSUFBZixDQUFvQixRQUFBLENBQUEsQ0FBQTtBQUNsQixRQUFBLFFBQUEsRUFBQSxRQUFBLEVBQUEsS0FBQSxFQUFBLGFBQUEsRUFBQSxTQUFBLEVBQUEsU0FBQSxFQUFBLFNBQUEsRUFBQSxhQUFBLEVBQUEsVUFBQSxFQUFBO0lBQUEsS0FBQSxHQUFRLENBQUEsQ0FBRSxJQUFGO0lBQ1IsUUFBQSxHQUFXLEtBQUssQ0FBQyxJQUFOLENBQVcsbUJBQVgsQ0FBK0IsQ0FBQyxHQUFoQyxDQUFvQyxhQUFwQztJQUNYLFFBQUEsR0FBVyxLQUFLLENBQUMsSUFBTixDQUFXLFNBQVg7SUFDWCxlQUFBLEdBQWtCLEtBQUssQ0FBQyxJQUFOLENBQVcsYUFBWDtJQUNsQixhQUFBLEdBQWdCLEtBQUssQ0FBQyxJQUFOLENBQVcsV0FBWDtJQUNoQixVQUFBLEdBQWEsaUNBTGI7OztJQVFBLElBQUcsUUFBUSxDQUFDLE1BQVQsS0FBbUIsQ0FBbkIsSUFBeUIsYUFBQSxLQUFpQixTQUExQyxJQUEwRCxlQUFBLEtBQXFCLFNBQWxGOzs7TUFHRSxTQUFBLEdBQVksUUFBQSxDQUFBLENBQUE7ZUFDVixHQUFBLEdBQU0sSUFBSSxDQUFDLE1BQUwsQ0FBQTtNQURJO0FBRVosYUFBQSxJQUFBO1FBQ0UsYUFBQSxHQUFnQixlQUFlLENBQUMsS0FBaEIsQ0FBc0IsRUFBdEIsQ0FBeUIsQ0FBQyxJQUExQixDQUErQixTQUEvQixDQUF5QyxDQUFDLElBQTFDLENBQStDLEVBQS9DO1FBQ2hCLElBQWEsYUFBQSxLQUFpQixlQUE5QjtBQUFBLGdCQUFBOztNQUZGLENBTEY7S0FSQTs7O0lBa0JBLElBQUcsYUFBQSxLQUFtQixTQUFuQixJQUFtQyxRQUFRLENBQUMsTUFBVCxLQUFtQixDQUF6RDtNQUNFLENBQUMsQ0FB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QWxCLEVBTEY7O01BRHFELENBQXZEO2FBUUEsS0FBSyxDQUFDLEVBQU4sQ0FBUyxhQUFULEVBQXdCLFFBQUEsQ0FBQSxDQUFBO2VBQ3RCLEtBQUssQ0FBQyxRQUFOLENBQWUsUUFBZjtNQURzQixDQUF4QjtJQXRIdUIsQ0FBekI7RUE3Q2tCLENBQXBCO0FBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIkKFwiLnNjcmFtYmxlXCIpLmVhY2ggLT5cbiAgJHRoaXMgPSAkKHRoaXMpXG4gICRsZXR0ZXJzID0gJHRoaXMuZmluZChcIi5zY3JhbWJsZWQtbGV0dGVyXCIpLm5vdChcIi5kcmFnLWNsb25lXCIpXG4gICRzcGFjZXJzID0gJHRoaXMuZmluZChcIi5zcGFjZXJcIilcbiAgdW5zY3JhbWJsZWRXb3JkID0gJHRoaXMuZGF0YShcInVuc2NyYW1ibGVkXCIpXG4gIHNjcmFtYmxlZFdvcmQgPSAkdGhpcy5kYXRhKFwic2NyYW1ibGVkXCIpXG4gIHNwYWNlckhUTUwgPSBcIjxzcGFuIGNsYXNzPVxcXCJzcGFjZXJcXFwiPjwvc3Bhbj5cIlxuICBcbiAgIyBJZiBubyBzY3JhbWJsZWQgdmVyc2lvbiBvZiB0aGUgd29yZCB3YXMgcHJvdmlkZWQsIGNyZWF0ZSBvbmUgYnkgcmFuZG9taXppbmcgdGhlIGxldHRlcnMgICAgXG4gIGlmICRsZXR0ZXJzLmxlbmd0aCBpcyAwIGFuZCBzY3JhbWJsZWRXb3JkIGlzIGB1bmRlZmluZWRgIGFuZCB1bnNjcmFtYmxlZFdvcmQgaXNudCBgdW5kZWZpbmVkYFxuICAgIFxuICAgICMgVGhpcyBkby13aGlsZSBsb29wIHdpbGwgcHJldmVudCB0aGUgc2NyYW1ibGVkIHdvcmQgZnJvbSBiZWluZyB0aGUgc2FtZSBhcyB0aGUgdW5zY3JhbWJsZWQgb25lIGR1ZSB0byB0ZXJyaWJseSBiYWQgbHVja1xuICAgIHJhbmRvbWl6ZSA9IC0+XG4gICAgICAwLjUgLSBNYXRoLnJhbmRvbSgpXG4gICAgbG9vcFxuICAgICAgc2NyYW1ibGVkV29yZCA9IHVuc2NyYW1ibGVkV29yZC5zcGxpdChcIlwiKS5zb3J0KHJhbmRvbWl6ZSkuam9pbihcIlwiKVxuICAgICAgYnJlYWsgdW5sZXNzIHNjcmFtYmxlZFdvcmQgaXMgdW5zY3JhbWJsZWRXb3JkXG4gIFxuICAjIENyZWF0ZSB0aGUgbGV0dGVycyBiYXNlZCBvbiB0aGUgZGF0YSBhdHRyaWJ1dGVcbiAgaWYgc2NyYW1ibGVkV29yZCBpc250IGB1bmRlZmluZWRgIGFuZCAkbGV0dGVycy5sZW5ndGggaXMgMFxuICAgICQubWFwIHNjcmFtYmxlZFdvcmQuc3BsaXQoXCJcIiksIChsZXR0ZXIpIC0+XG4gICAgICAkdGhpcy5hcHBlbmQgXCI8c3BhbiBjbGFzcz1cXFwic2NyYW1ibGVkLWxldHRlclxcXCI+XCIgKyBsZXR0ZXIgKyBcIjwvc3Bhbj5cIlxuXG4gICAgJGxldHRlcnMgPSAkdGhpcy5maW5kKFwiLnNjcmFtYmxlZC1sZXR0ZXJcIikubm90KFwiLmRyYWctY2xvbmVcIilcbiAgXG4gICMgRnVuY3Rpb24gdG8gc3Vycm91bmQgYWxsIGxldHRlcnMgaW4gc3BhY2Vyc1xuICBpbnNlcnRTcGFjZXJzID0gLT5cbiAgICAkdGhpcy5maW5kKFwiLnNwYWNlclwiKS5yZW1vdmUoKVxuICAgICRsZXR0ZXJzLmJlZm9yZShzcGFjZXJIVE1MKS5sYXN0KCkuYWZ0ZXIgc3BhY2VySFRNTFxuICAgICRzcGFjZXJzID0gJHRoaXMuZmluZChcIi5zcGFjZXJcIilcbiAgICByZXR1cm5cbiAgaW5zZXJ0U3BhY2VycygpXG4gIFxuICAjIEZ1bmN0aW9uIHRvIHJldHVybiB3aGF0ZXZlciB0aGUgY3VycmVudGx5IGFycmFuZ2VkIHdvcmQgaXMgICAgXG4gIHBhcnNlV29yZCA9IC0+XG4gICAgd29yZCA9IFwiXCJcbiAgICAkbGV0dGVycy5lYWNoIC0+XG4gICAgICB3b3JkICs9ICQodGhpcykudGV4dCgpLnJlcGxhY2UoL1teYS16QS1aXS9nLCBcIlwiKVxuICAgIHdvcmQudG9Mb3dlckNhc2UoKVxuICBcbiAgIyBGdW5jdGlvbiB0byByZXR1cm4gd2hldGhlciB0aGUgY3VycmVudGx5IGFycmFuZ2VkIGxldHRlciBzZXF1ZW5jZSBpcyB0aGUgY29ycmVjdC91bnNjcmFtYmxlZCBvbmUgIFxuICBpc0NvcnJlY3QgPSAtPlxuICAgIHBhcnNlV29yZCgpIGlzIHVuc2NyYW1ibGVkV29yZC50b0xvd2VyQ2FzZSgpXG5cbiAgIyBXaGF0IGhhcHBlbnMgd2hlbiB5b3UgbW91c2Vkb3duL2NsaWNrZW5ob2xkIG9uIGEgbGV0dGVyXG4gICRsZXR0ZXJzLm9uIFwibW91c2Vkb3duXCIsIChlKSAtPlxuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgXG4gICAgJHRoaXNMZXR0ZXIgPSAkKHRoaXMpXG4gICAgdGhpc0xldHRlcldpZHRoID0gJHRoaXNMZXR0ZXIub3V0ZXJXaWR0aCgpXG4gICAgdGhpc0xldHRlckhlaWdodCA9ICR0aGlzTGV0dGVyLm91dGVySGVpZ2h0KClcbiAgICAkdGhpcy5hZGRDbGFzcyBcImRyYWdnaW5nXCJcbiAgICBcbiAgICAjIEVzdGFibGlzaCBhIGNsb25lIG9mIHRoZSBjdXJyZW50bHkgc2VsZWN0ZWQgbGV0dGVyIGFuZCBhZGQgaXQgdG8gdGhlIERPTVxuICAgICRsZXR0ZXJDbG9uZSA9ICR0aGlzTGV0dGVyLmNsb25lKGZhbHNlKVxuICAgICRsZXR0ZXJDbG9uZS5pbnNlcnRCZWZvcmUgJHRoaXNMZXR0ZXJcbiAgICBcbiAgICAjIElmIHRoaXMgaXMgYSBcIm1pZGRsZVwiIGxldHRlciAobGV0dGVycyBvbiBib3RoIHNpZGVzKSwgb25lIG9mIHRoZSBzcGFjZXJzIG5lZWRzIHRvIGJlIHNwZWNpZmllZCBhcyBleHRyYVxuICAgIGlmICR0aGlzTGV0dGVyLnByZXZBbGwoXCIuc2NyYW1ibGVkLWxldHRlclwiKS5sZW5ndGggPiAwIGFuZCAkdGhpc0xldHRlci5uZXh0QWxsKFwiLnNjcmFtYmxlZC1sZXR0ZXJcIikubGVuZ3RoID4gMFxuICAgICAgJHRoaXNMZXR0ZXIubmV4dEFsbChcIi5zcGFjZXJcIikuZmlyc3QoKS5hZGRDbGFzcyBcImV4dHJhXCJcbiAgICAgIFxuICAgICMgSGlkZSB0aGUgbGV0dGVyIHlvdSBjbGlja2VkLCBiZWNhdXNlIHdlJ3JlIGdvaW5nIHRvIHB1dCB0aGUgY2xvbmUgb2YgaXQgdW5kZXIgdGhlIGN1cnNvciBhcyBpdCBtb3Zlc1xuICAgICR0aGlzTGV0dGVyLmFkZENsYXNzIFwiaW52aXNpYmxlXCJcbiAgICAkbGV0dGVyQ2xvbmUuYWRkQ2xhc3MgXCJkcmFnLWNsb25lXCJcbiAgICAgICAgXG4gICAgIyBGdW5jdGlvbiB0byBwb3NpdGlvbiB0aGUgY2xvbmUgdy8gdGhlIG1vdXNlXG4gICAgbW92ZUxldHRlcldpdGhNb3VzZSA9IChlKSAtPlxuICAgICAgJGxldHRlckNsb25lLmNzc1xuICAgICAgICB0b3A6IGUuY2xpZW50WSAtICh0aGlzTGV0dGVySGVpZ2h0ICogMC41KVxuICAgICAgICBsZWZ0OiBlLmNsaWVudFggLSAodGhpc0xldHRlcldpZHRoICogMC41KVxuXG4gICAgIyBSdW4gdGhlIGZ1bmN0aW9uIG9uY2UgdG8gcGxhY2UgdGhlIGxldHRlciBjbG9uZSB3aGVyZXZlciB5b3VyIGN1cnNvciBpcyB3aGVuIHlvdSBjbGlja2VkICAgIFxuICAgIG1vdmVMZXR0ZXJXaXRoTW91c2UgZVxuICAgIFxuICAgICMgRnVuY3Rpb24gdG8gc25hcCBsZXR0ZXIgdG8gcGxhY2Ugd2hlbiBsZXR0aW5nIGdvXG4gICAgc25hcExldHRlclRvUGxhY2UgPSAtPlxuICAgICAgIyBVbmhpZGUgdGhlIG9yaWdpbmFsIGxldHRlciAoaXQgc2hvdWxkIHN0aWxsIGJlIC5pbnZpc2libGUgaG93ZXZlcilcbiAgICAgICR0aGlzTGV0dGVyLnNob3coKVxuICAgICAgXG4gICAgICAjIEFkZCB0aGUgLnNuYXAtdG8tcGxhY2UgY2xhc3MgdG8gdGhlIGNsb25lICh3aGljaCB3aWxsIGVuYWJsZSBDU1MgdHJhbnNpdGlvbnMpIGFuZCB0aGVuIGNoYW5nZSBpdHMgcG9zaXRpb24gdG8gbGluZSB1cCB3LyB0aGUgcmVhbCBsZXR0ZXJcbiAgICAgIHJlYWxMZXR0ZXJPZmZzZXQgPSAkdGhpc0xldHRlci5vZmZzZXQoKVxuICAgICAgJGxldHRlckNsb25lLmFkZENsYXNzKFwic25hcC10by1wbGFjZVwiKS5jc3NcbiAgICAgICAgdG9wOiByZWFsTGV0dGVyT2Zmc2V0LnRvcFxuICAgICAgICBsZWZ0OiByZWFsTGV0dGVyT2Zmc2V0LmxlZnRcblxuICAgICAgIyBLaWxsIHRoZSBjbG9uZSwgc2hvdyB0aGUgcmVhbCBvbmUgYWZ0ZXIgdGhlIGFuaW1hdGlvbiBoYXMgZW5vdWdoIHRpbWUgdG8gZmluaXNoXG4gICAgICBzZXRUaW1lb3V0ICgtPlxuICAgICAgICAkbGV0dGVyQ2xvbmUucmVtb3ZlKClcbiAgICAgICAgJHRoaXNMZXR0ZXIucmVtb3ZlQ2xhc3MgXCJpbnZpc2libGVcIlxuICAgICAgKSwgNTAwXG5cbiAgICAjIEZ1bmN0aW9uIHRvIGRyb3AgdGlsZSBpbnRvIHNwYWNlclxuICAgIGRyb3BJbnRvU3BhY2VyID0gKCR0aGlzU3BhY2VyKSA9PiAgXG4gICAgICAjIE1vdmUgb3JpZ2luYWwgbGV0dGVyIDxzcGFuPiB0byByaWdodCBiZWZvcmUgdGhlIHNwYWNlciBiZWluZyBob3ZlcmVkIG92ZXJcbiAgICAgICR0aGlzTGV0dGVyLnNob3coKS5hZGRDbGFzcyhcImludmlzaWJsZVwiKS5pbnNlcnRCZWZvcmUgJHRoaXNTcGFjZXJcbiAgICAgIFxuICAgICAgIyBSZS1lc3RhYmxpc2ggdGhlICRsZXR0ZXJzIG9iamVjdCB0byB1c2UgdGhlIG5ldyBuYXR1cmFsIERPTSBvcmRlclxuICAgICAgJGxldHRlcnMgPSAkdGhpcy5maW5kKFwiLnNjcmFtYmxlZC1sZXR0ZXJcIikubm90KFwiLmRyYWctY2xvbmVcIilcbiAgICAgIFxuICAgICAgIyBEZWxldGUgYW5kIHJlLWVzdGFibGlzaCB0aGUgc3BhY2Vyc1xuICAgICAgaW5zZXJ0U3BhY2VycygpXG4gICAgICBzbmFwTGV0dGVyVG9QbGFjZSgpXG4gICAgICBcbiAgICAgICMgU2VlIGlmIHlvdSBnb3QgdGhlIHdvcmQgY29ycmVjdFxuICAgICAgJHRoaXMudHJpZ2dlciBcInVuc2NyYW1ibGVkXCIgIGlmIGlzQ29ycmVjdCgpXG5cbiAgICAjIFdoZW4geW91J3JlIGRyYWdnaW5nIGEgdGlsZSwgaWYgeW91IGFwcHJvYWNoIHRoZSBlZGdlIG9mIGEgbGV0dGVyIHRpbGUsIGFzc3VtZSB5b3UncmUgYWltaW5nIGZvciB0aGF0IHNpZGUgb2YgaXQgXG4gICAgJGxldHRlcnMubm90KCcuZHJhZy1jbG9uZScpLm5vdCgnLmludmlzaWJsZScpLm1vdXNlbW92ZSggKGUpIC0+XG4gICAgICAkdGhpc01vdXNlTW92ZUxldHRlciA9ICQodGhpcylcbiAgICAgIGxldHRlck9mZnNldCA9ICR0aGlzTW91c2VNb3ZlTGV0dGVyLm9mZnNldCgpICAgICBcbiAgICAgIGxlZnRPZmZzZXQgPSBlLm9mZnNldFggfHwgZS5jbGllbnRYIC0gbGV0dGVyT2Zmc2V0LmxlZnRcbiAgICAgIGxldHRlcldpZHRoID0gJHRoaXNNb3VzZU1vdmVMZXR0ZXIub3V0ZXJXaWR0aCgpXG4gICAgICBoYWxmUG9pbnQgPSBsZXR0ZXJXaWR0aCAvIDJcbiAgICAgIHByZXZMZXR0ZXJzID0gJHRoaXNMZXR0ZXIucHJldkFsbCgnLnNjcmFtYmxlZC1sZXR0ZXInKS5ub3QoJy5kcmFnLWNsb25lJykubm90KCcuaW52aXNpYmxlJykubGVuZ3RoXG4gICAgICBuZXh0TGV0dGVycyA9ICR0aGlzTGV0dGVyLm5leHRBbGwoJy5zY3JhbWJsZWQtbGV0dGVyJykubm90KCcuZHJhZy1jbG9uZScpLm5vdCgnLmludmlzaWJsZScpLmxlbmd0aFxuICAgICAgXG4gICAgICAkc3BhY2Vycy5maWx0ZXIoJy5ob3ZlcicpLnJlbW92ZUNsYXNzKFwiaG92ZXJcIilcbiAgICAgIFxuICAgICAgaWYgcHJldkxldHRlcnMgPiAwIGFuZCBsZWZ0T2Zmc2V0ID4gMCBhbmQgbGVmdE9mZnNldCA8IGhhbGZQb2ludFxuICAgICAgICAkdGhpc01vdXNlTW92ZUxldHRlci5wcmV2QWxsKCcuc3BhY2VyJykubm90KCcuZXh0cmEnKS5maXJzdCgpLmFkZENsYXNzIFwiaG92ZXJcIlxuICAgICAgZWxzZSBpZiBuZXh0TGV0dGVycyA+IDAgYW5kIGxlZnRPZmZzZXQgPCBsZXR0ZXJXaWR0aCBhbmQgbGVmdE9mZnNldCA+IGhhbGZQb2ludFxuICAgICAgICAkdGhpc01vdXNlTW92ZUxldHRlci5uZXh0QWxsKCcuc3BhY2VyJykubm90KCcuZXh0cmEnKS5maXJzdCgpLmFkZENsYXNzIFwiaG92ZXJcIlxuICAgIFxuICAgICkubW91c2V1cCgtPlxuICAgICAgIyBJZiB5b3UgbW91c2V1cCBpbiBzdWNoIGEgY2lyY3Vtc3RhbmNlLCBkcm9wIHRoZSB0aWxlXG4gICAgICAkdGhpc1NwYWNlciA9ICRzcGFjZXJzLmZpbHRlcignLmhvdmVyJykuZmlyc3QoKVxuICAgICAgZHJvcEludG9TcGFjZXIoJHRoaXNTcGFjZXIpIGlmICR0aGlzU3BhY2VyLmxlbmd0aCA+IDBcbiAgICAgIFxuICAgICkubW91c2VsZWF2ZSgtPlxuICAgICAgJHNwYWNlcnMuZmlsdGVyKCcuaG92ZXInKS5yZW1vdmVDbGFzcyhcImhvdmVyXCIpXG4gICAgKVxuXG5cbiAgICAkc3BhY2Vycy5ub3QoJy5leHRyYScpLmhvdmVyKC0+XG4gICAgXG4gICAgICAjIFdoZW4geW91IGhvdmVyIG92ZXIgYSBzcGFjZXI6XG4gICAgICAkKHRoaXMpLmFkZENsYXNzIFwiaG92ZXJcIiBcbiAgICAgIFxuICAgICAgIyBIaWRlIHRoZSByZWFsIGxldHRlciAod2hpY2ggd2FzIHByZXZpb3VzbHkgb25seSAuaW52aXNpYmxlKSBvbmNlIHlvdSd2ZSBob3ZlcmVkIG92ZXIgYSBzcGFjZXJcbiAgICAgICMgc28gdGhhdCBpdHMgZW1wdHkgcGxhY2Vob2xkZXIgd2lsbCBkaXNhcHBlYXIgYW5kIChzZWVtaW5nbHkpIHJlYXBwZWFyIHdoZXJldmVyIHlvdSBob3ZlclxuICAgICAgJHRoaXNMZXR0ZXIuaGlkZSgpXG4gICAgICBcbiAgICAsIC0+XG4gICAgICAjIFdoZW4geW91IGV4aXQgaG92ZXJpbmcgYSBzcGFjZXI6XG4gICAgICAkKHRoaXMpLnJlbW92ZUNsYXNzIFwiaG92ZXJcIlxuICAgICkubW91c2V1cCAtPlxuICAgICAgXG4gICAgICAjIE1vdXNldXAgZnVuY3Rpb24gb24gc3BhY2VyLCB0cmlnZ2VycyB3aGVuIHlvdSBcImxldCBnb1wiIG9mIHRoZSBsZXR0ZXIgeW91J3JlIGRyYWdnaW5nXG4gICAgICAkdGhpc1NwYWNlciA9ICQodGhpcylcbiAgICAgIFxuICAgICAgZHJvcEludG9TcGFjZXIoJHRoaXNTcGFjZXIpXG4gICAgICAgICAgICBcbiAgICAgIHJldHVyblxuXG4gICAgIyBBbHNvIGF0dGFjaCB0aGUgbW91c2UgZHJhZyBldmVudHMgdG8gdGhlIHdob2xlIGJvZHksIHNvIHlvdSBjYW4gZHJhZyB0aGUgbGV0dGVyIGFueXdoZXJlIGFuZCBzdGlsbCBzZWUgaXQgIFxuICAgICQoXCJib2R5XCIpLm1vdXNlbW92ZShtb3ZlTGV0dGVyV2l0aE1vdXNlKS5vbiBcIm1vdXNldXBcIiwgLT5cbiAgICAgIGlmICR0aGlzLmhhc0NsYXNzKFwiZHJhZ2dpbmdcIikgb3IgJChcIi5kcmFnLWNsb25lXCIpLmxlbmd0aCA+IDBcbiAgICAgICAgJChcImJvZHlcIikudW5iaW5kIFwibW91c2Vtb3ZlXCIsIG1vdmVMZXR0ZXJXaXRoTW91c2VcbiAgICAgICAgJHNwYWNlcnMudW5iaW5kIFwibW91c2Vtb3ZlIG1vdXNlb3ZlciBtb3VzZW91dCBtb3VzZWVudGVyIG1vdXNlbGVhdmUgbW91c2V1cFwiXG4gICAgICAgICRsZXR0ZXJzLnVuYmluZCBcIm1vdXNlbW92ZSBtb3VzZWxlYXZlXCJcbiAgICAgICAgc25hcExldHRlclRvUGxhY2UoKVxuICAgICAgICAkdGhpcy5yZW1vdmVDbGFzcyBcImRyYWdnaW5nXCJcbiAgICAgICAgXG4gICAgJHRoaXMub24gXCJ1bnNjcmFtYmxlZFwiLCAtPlxuICAgICAgJHRoaXMuYWRkQ2xhc3MgXCJzb2x2ZWRcIlxuXG5cbiJdfQ==
//# sourceURL=coffeescript