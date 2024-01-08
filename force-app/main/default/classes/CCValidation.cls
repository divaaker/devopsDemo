public class CCValidation {
	public boolean CCValidationMethod(String CCNumber){
    Integer sum = 0;
    Integer len = CCNumber.length();
    for(Integer i=len-1;i>=0;i--){
    Integer num = Integer.ValueOf(CCNumber.substring(i,i+1));
    if ( math.mod(i , 2) == math.mod(len, 2) )
    {
    Integer n = num * 2;
    sum += (n / 10) + ( math.mod(n, 10));
    }
    else{
    sum += num;
    }
    }
        system.debug(( math.mod( sum, 10) == 0 ));
    	return ( math.mod( sum, 10) == 0 );
	}
}