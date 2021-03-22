import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appNoSpace]'
})
export class NoSpaceDirective {

  constructor(private el: ElementRef) { }

  private replace(value: string): boolean {
    this.el.nativeElement.value = value.replace(/\s/g, '-');
    return true;
  }

  private run(oldValue: string): void {
    setTimeout(() => {
      const currentValue = this.el.nativeElement.value;
      this.el.nativeElement.value = (currentValue !== '' && !this.replace(currentValue)) ? oldValue : currentValue;
    });
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    this.run(this.el.nativeElement.value);
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent): void {
    this.run(this.el.nativeElement.value);
  }

}
