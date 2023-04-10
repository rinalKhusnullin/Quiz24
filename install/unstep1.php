<?php
	IncludeModuleLangFile(__FILE__);
?>

<form action="<?=$APPLICATION->GetCurPage()?>">
	<?=bitrix_sessid_post()?>
	<input type="hidden" name="lang" value="<?=LANG?>">
	<input type="hidden" name="id" value="up.quiz">
	<input type="hidden" name="uninstall" value="Y">
	<input type="hidden" name="step" value="2">
	<input type="submit" name="inst" value="<?=GetMessage("MOD_UNINST_DEL")?>">
</form>